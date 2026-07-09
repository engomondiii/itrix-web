import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { QualificationAnswers } from '@/types/qualification.types';
import type { ScoreBreakdown, LeadTier } from '@/types/lead.types';
import type { ProductRoute, LicensePathway } from '@/types/product.types';
import type { JourneyState } from '@/types/journey.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface QualifyBody {
  sessionId?: string | null;
  clientId?: string | null;
  answers?: QualificationAnswers;
}

/**
 * The exact shape the public site (`reviewApi.qualify` → `useReviewFlow`) reads.
 * The backend historically returned snake_case with a nested `score` object and did
 * NOT include the journey token/state; this proxy now normalizes whatever the backend
 * sends into this camelCase contract so the two sides can never drift again.
 */
interface QualifyResponse {
  leadId: string | null;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  tier: LeadTier;
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
  capabilityToken: string | null;
  journeyState: JourneyState | null;
}

/** A permissive view of the backend body (accepts both snake_case and camelCase). */
type BackendQualify = Record<string, unknown> & {
  lead_id?: string | null;
  leadId?: string | null;
  score?: { breakdown?: ScoreBreakdown; total?: number } | null;
  score_breakdown?: ScoreBreakdown;
  scoreBreakdown?: ScoreBreakdown;
  score_total?: number;
  total_score?: number;
  totalScore?: number;
  tier?: number;
  product_route?: string;
  productRoute?: string;
  license_pathway?: string | null;
  licensePathway?: string | null;
  capability_token?: string | null;
  capabilityToken?: string | null;
  journey_state?: string | null;
  journeyState?: string | null;
  // The journey reveal descriptor may also carry the token (defensive extraction).
  reveal?: { capability_token?: string | null; capabilityToken?: string | null; state?: string | null } | null;
  reveals?: Array<{ capability_token?: string | null; capabilityToken?: string | null; state?: string | null }> | null;
};

const EMPTY_BREAKDOWN: ScoreBreakdown = {
  strategic_fit: 0,
  technical_fit: 0,
  urgency: 0,
  budget_authority: 0,
  license_potential: 0,
};

function coerceTier(v: unknown): LeadTier {
  const n = typeof v === 'number' ? v : Number(v);
  return (n === 1 || n === 2 || n === 3 || n === 4 ? n : 4) as LeadTier;
}

function firstToken(...vals: Array<unknown>): string | null {
  for (const v of vals) {
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return null;
}

/** Normalize the backend body into the camelCase contract the client reads. */
function normalize(raw: BackendQualify): QualifyResponse {
  const breakdown =
    raw.scoreBreakdown ??
    raw.score_breakdown ??
    (raw.score?.breakdown as ScoreBreakdown | undefined) ??
    EMPTY_BREAKDOWN;

  const total =
    (typeof raw.totalScore === 'number' ? raw.totalScore : undefined) ??
    (typeof raw.total_score === 'number' ? raw.total_score : undefined) ??
    (typeof raw.score_total === 'number' ? raw.score_total : undefined) ??
    (typeof raw.score?.total === 'number' ? raw.score?.total : undefined) ??
    0;

  // The token may live at the top level (either casing) or inside a reveal descriptor.
  const revealToken =
    raw.reveal?.capability_token ??
    raw.reveal?.capabilityToken ??
    (Array.isArray(raw.reveals)
      ? raw.reveals.map((r) => r?.capability_token ?? r?.capabilityToken).find(Boolean) ?? null
      : null);

  const capabilityToken = firstToken(raw.capabilityToken, raw.capability_token, revealToken);

  const revealState = raw.reveal?.state ?? (Array.isArray(raw.reveals) ? raw.reveals[0]?.state : null);
  const journeyState =
    (firstToken(raw.journeyState, raw.journey_state, revealState) as JourneyState | null) ?? null;

  return {
    leadId: (raw.leadId ?? raw.lead_id ?? null) as string | null,
    totalScore: total,
    scoreBreakdown: breakdown,
    tier: coerceTier(raw.tier),
    productRoute: (raw.productRoute ?? raw.product_route ?? 'alpha_compute') as ProductRoute,
    licensePathway: (raw.licensePathway ?? raw.license_pathway ?? null) as LicensePathway | null,
    capabilityToken,
    journeyState,
  };
}

/**
 * Proxies qualification answers to Django for authoritative scoring + lead creation.
 *
 * v4.0: Django advances the journey to CLIENT_PAGE and mints a client-page capability
 * token during qualification. This proxy normalizes the backend response (which is
 * snake_case with a nested `score` object) into the camelCase contract the browser
 * reads — including `capabilityToken` and `journeyState` — so the /review/preparing
 * hand-off can forward the visitor to /c/[token].
 *
 * Failure behaviour:
 *   • Missing sessionId → 502 (client uses its local estimate + retry).
 *   • Backend non-2xx / unreachable → 502 (same fallback).
 *   • Backend 2xx but missing token → we STILL return the mapped scoring with
 *     capabilityToken:null; the preparing page then falls back to polling the journey
 *     endpoint instead of dead-ending.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as QualifyBody;
  if (!body.sessionId) {
    return NextResponse.json({ error: { detail: 'No review session — using local estimate.' } }, { status: 502 });
  }
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.reviewQualify(body.sessionId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ answers: body.answers ?? {} }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: { detail: `Backend qualify failed (${res.status}).` } }, { status: 502 });
    }
    const raw = (await res.json().catch(() => ({}))) as BackendQualify;
    const mapped = normalize(raw);
    return NextResponse.json(mapped);
  } catch (e) {
    return NextResponse.json(
      { error: { detail: e instanceof Error ? e.message : 'Backend unreachable.' } },
      { status: 502 },
    );
  }
}
