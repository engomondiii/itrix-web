import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { buildImmediateResponse } from '@/lib/content/immediateResponses';
import { familyForPrompt } from '@/lib/content/examplePrompts';
import type { PressureArea } from '@/types/review.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Resolve the backend base URL from any of the vars we might have set on Railway.
 * (Different deploys have used API_URL, NEXT_PUBLIC_API_URL, or DJANGO_API_URL.)
 * Trailing slashes are trimmed so we never build a `//` path.
 */
function resolveApiBase(): string {
  const raw =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.DJANGO_API_URL ??
    'http://localhost:8000/api/v1';
  return raw.replace(/\/+$/, '');
}

interface SubmitBody {
  prompt?: string;
  selectedPressures?: PressureArea[];
  environment?: string | null;
  sessionId?: string | null;
  clientId?: string | null;
  visitorType?: string | null;
  /**
   * The functional-family prior, when the visitor used one of the five example
   * prompts. INTERNAL routing signal only — it is never returned to the client
   * and never rendered (Architecture v2.5 §4.2, §9.4).
   */
  family?: string | null;
}

/**
 * Creates/continues a backend review session and records THE FIRST REVIEW TURN.
 *
 * v4.0 CONTRACT (Surface 1 v4.0 §2.3)
 * ---------------------------------------------------------------------------
 * The sentence the visitor typed on the approved center IS the first review
 * turn. This route persists it against the session so the review surface can
 * continue from it rather than asking again. `first_turn: true` tells the
 * backend this prompt originated at the center, so the Concierge opens by
 * mirroring rather than by prompting.
 *
 * If the visitor selected one of the five example chips we also pass the
 * functional family as a routing PRIOR. It is a hypothesis, never a conclusion,
 * and it is never echoed back to the visitor.
 *
 * HARDENED (v4.0.3, retained): resolves the base URL from all known env vars,
 * follows redirects, parses the id defensively, and never silently swallows
 * failures. On any backend problem it still returns a usable body (sessionId may
 * be null so the client shows the local acknowledgement) BUT attaches a `debug`
 * object describing exactly what happened, so a null sessionId is diagnosable
 * from the response alone.
 */
export async function POST(req: Request) {
  const API_BASE = resolveApiBase();
  const body = (await req.json().catch(() => ({}))) as SubmitBody;
  const prompt = body.prompt ?? '';
  const pressures = body.selectedPressures ?? [];
  const immediateResponse = buildImmediateResponse(prompt, pressures);

  // Derive the family prior server-side too, so a client that omits it still
  // gets the benefit and a client that fakes it cannot claim an unknown family.
  const family = familyForPrompt(prompt) ?? (body.family || null);

  let sessionId: string | null = body.sessionId ?? null;
  const debug: Record<string, unknown> = { apiBase: API_BASE };

  try {
    if (!sessionId) {
      const url = `${API_BASE}${apiRoutes.reviewSession}`;
      debug.sessionUrl = url;
      const created = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        cache: 'no-store',
        redirect: 'follow',
        // Backend CharFields reject null — only include these when we actually have a
        // value, so the serializer's defaults ("" / "unknown") apply otherwise.
        body: JSON.stringify({
          ...(body.clientId ? { client_id: body.clientId } : {}),
          ...(body.visitorType ? { visitor_type: body.visitorType } : {}),
        }),
      });
      debug.sessionStatus = created.status;

      const text = await created.text();
      let data: { id?: string; session_id?: string } | null = null;
      try {
        data = JSON.parse(text) as { id?: string; session_id?: string };
      } catch {
        debug.sessionBodySnippet = text.slice(0, 200);
      }

      if (created.ok && data) {
        sessionId = data.id ?? data.session_id ?? null;
        if (!sessionId) debug.sessionParse = 'no id/session_id in body';
      } else if (!created.ok) {
        debug.sessionError = `backend returned ${created.status}`;
        if (!data) debug.sessionBodySnippet = text.slice(0, 200);
      }
    }

    if (sessionId) {
      const purl = `${API_BASE}${apiRoutes.reviewPrompt(sessionId)}`;
      const promptRes = await fetch(purl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        cache: 'no-store',
        redirect: 'follow',
        body: JSON.stringify({
          prompt,
          pressure_areas: pressures,
          environment: body.environment ?? null,
          // v4.0: this prompt IS the first review turn, not a pre-review capture.
          first_turn: true,
          ...(family ? { functional_family: family } : {}),
        }),
      });
      debug.promptStatus = promptRes.status;
    }
  } catch (e) {
    debug.exception = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  // `family` is deliberately NOT returned — it is an internal routing prior.
  return NextResponse.json({ sessionId, immediateResponse, debug });
}
