import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/shell — the shell contract (Backend v6.0 §3.1).
 *
 * REPLACES the rails proxy. It returns sidebar sections, the conversation header
 * and the composer label; `left_rail` and `right_rail` are gone.
 *
 * ── WHY THIS ROUTE DOES MORE THAN FORWARD (v6.0 contract fix) ───────────────
 * It previously called `GET {API_BASE}/shell/`, which DOES NOT EXIST on the
 * backend. Django mounts the contract at `/threads/{id}/shell/` and also embeds
 * it in the thread detail response. Every call 404'd, the client fell back to
 * the five base sections, and the sidebar never grew past State 1 — silently,
 * because the fallback is deliberately quiet.
 *
 * Two further mismatches had to be closed here:
 *
 *   1. CASING. Django emits snake_case (`journey_state`, `state_key`,
 *      `sidebar_sections`); `ShellContract` is camelCase. Unnormalised, every
 *      field read as `undefined`.
 *
 *   2. STATE KEY VOCABULARY. Django's `state_key` is the ENUM NAME (`ARRIVED`,
 *      `NDA_REVIEW`). The frontend `StateKey` type is the slug (`arrival`,
 *      `nda`). They are two names for the same thing and the mapping lives in
 *      `journeyStates.ts` — so it is applied here, once, at the boundary.
 *
 * This is the right layer for it. `api/client-page/[token]/route.ts` already
 * normalises the same way and for the same reason: the BFF absorbs wire-shape
 * differences so no component ever has to know the backend's field casing.
 *
 * THE FAILURE MODE IS UNCHANGED AND DELIBERATE. On any error this returns an
 * EMPTY payload rather than a permissive default. The client then falls back to
 * the five base sections — the most restrictive sidebar there is. If the backend
 * is down or the vocabularies drift, the visitor sees LESS than they were
 * entitled to, never more.
 */

/** Django `state_key` (enum name) → frontend `StateKey` (slug). */
const STATE_KEY_SLUG: Record<string, string> = {
  ARRIVED: 'arrival',
  IN_REVIEW: 'listening',
  DIAGNOSED: 'reflection',
  CLIENT_PAGE: 'pitch-room',
  INVITED: 'qualified',
  NDA_REVIEW: 'nda',
  ASSESSMENT: 'assessment',
  POC: 'poc',
  INTEGRATION: 'integration',
  CUSTOMER_SUCCESS: 'customer-success',
  DORMANT: 'dormant',
  // Legacy values the backend can still READ from a stale row, even though
  // Phase 3 removed them from the enum. Mapped forward so a pre-migration row
  // renders rather than falling through to the unknown branch.
  CLIENT: 'nda',
  ENGAGED: 'assessment',
};

/**
 * A `thr_local_…` id is the composer's OPTIMISTIC id, minted so the visitor's
 * sentence renders instantly, before any network call. The backend has never
 * seen it and never will — it is swapped for the server id the moment
 * `POST /threads/` answers.
 *
 * Between those two moments, hooks keyed on the active thread fire with the
 * local id. Forwarding those to Django produced the 404 pairs in the console:
 * harmless, transient, and indistinguishable at a glance from a real failure —
 * which is the actual cost. A console that cries wolf during normal operation
 * trains you to ignore it.
 *
 * So a local id is answered HERE, without a round trip. It is not an error
 * condition; it is a request about a thread that does not exist yet.
 */
function isLocalId(id: string): boolean {
  return id.startsWith('thr_local_');
}

type Raw = Record<string, unknown>;

const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);
const bool = (v: unknown): boolean => v === true;

function normaliseHeader(raw: unknown): Raw | null {
  if (!raw || typeof raw !== 'object') return null;
  const h = raw as Raw;
  return {
    title: str(h.title) ?? '',
    stateLabel: str(h.state_label) ?? str(h.stateLabel) ?? '',
    humanOwner: str(h.human_owner) ?? str(h.humanOwner),
    supportSla: str(h.support_sla) ?? str(h.supportSla),
    quickHelp: bool(h.quick_help ?? h.quickHelp),
  };
}

/**
 * Map Django's shell payload onto `ShellContractPayload`.
 *
 * Tolerates BOTH casings on every field. That is not defensive clutter: the
 * thread-detail response and the dedicated shell endpoint are produced by the
 * same builder today, but accepting either shape means a future serializer
 * change cannot silently blank the sidebar.
 */
function normaliseShell(raw: Raw): Raw {
  const stateKeyRaw = str(raw.state_key) ?? str(raw.stateKey) ?? 'ARRIVED';
  const sections = raw.sidebar_sections ?? raw.sidebarSections;

  return {
    threadId: str(raw.thread_id) ?? str(raw.threadId),
    journeyState:
      typeof raw.journey_state === 'number'
        ? raw.journey_state
        : typeof raw.journeyState === 'number'
          ? raw.journeyState
          : null,
    // The slug form the components expect. Unknown values fall through to
    // 'arrival' — the most restrictive state there is.
    stateKey: STATE_KEY_SLUG[stateKeyRaw] ?? 'arrival',
    identityState: str(raw.identity_state) ?? str(raw.identityState) ?? 'anonymous',
    disclosureCeiling: str(raw.disclosure_ceiling) ?? str(raw.disclosureCeiling) ?? 'public',
    valueDelivered: bool(raw.value_delivered ?? raw.valueDelivered),
    composerLabel: str(raw.composer_label) ?? str(raw.composerLabel) ?? '',
    questionLoopOpen: bool(raw.question_loop_open ?? raw.questionLoopOpen),
    attachmentsEnabled: bool(raw.attachments_enabled ?? raw.attachmentsEnabled),
    sidebarSections: Array.isArray(sections) ? sections.filter((s) => typeof s === 'string') : [],
    conversationHeader: normaliseHeader(raw.conversation_header ?? raw.conversationHeader),
  };
}

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie');
  const thread = new URL(req.url).searchParams.get('thread');

  // No thread means no relationship yet. The backend has nothing to say, and an
  // empty payload gives the client the base sections — which is correct for a
  // first-time visitor rather than an error to report.
  // No thread, or a thread the backend has not issued yet. Either way there is
  // nothing to ask about, and an empty payload gives the client the base
  // sections — correct for a conversation that has not started.
  if (!thread || isLocalId(thread)) return NextResponse.json({}, { status: 200 });

  try {
    const res = await fetch(`${API_BASE}/threads/${encodeURIComponent(thread)}/shell/`, {
      method: 'GET',
      headers: { Accept: 'application/json', ...(cookie ? { cookie } : {}) },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({}, { status: res.status });
    const payload = (await res.json()) as Raw;
    return NextResponse.json(normaliseShell(payload), { status: 200 });
  } catch {
    return NextResponse.json({}, { status: 503 });
  }
}
