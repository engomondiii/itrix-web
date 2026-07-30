/**
 * Backend wire shapes → frontend contracts (Backend v6.0 §7.1).
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * Django's thread serializers and the frontend's `thread.types.ts` describe the
 * same objects with different names. Left unnormalised, `threadsApi.create()`
 * returned the raw Django body and `useComposer` read `result.data.thread.id`
 * off an object with no `thread` key:
 *
 *     Uncaught (in promise) TypeError:
 *       Cannot read properties of undefined (reading 'id')
 *
 * That single failure is the root of every symptom. When the swap from the
 * optimistic `thr_local_…` id to the real server id never happened, the surface
 * kept using the local id for everything afterwards — so `/api/shell?thread=…`,
 * `/api/threads/…` and `…/turns` all 404'd against ids the backend had never
 * issued, and the visitor saw "We could not reach itriX just now."
 *
 * The mapping, in full:
 *
 *     Django                          frontend
 *     ─────────────────────────────   ───────────────────────────
 *     threadId                        id
 *     at                              createdAt
 *     senderKind: visitor | client    role: 'visitor'
 *     senderKind: agent  | system     role: 'itrix'
 *     streamingStatus                 status
 *     underReview: true               status: 'under_review'
 *
 * This is the same boundary, and the same reasoning, as the normalisation
 * already living in `api/client-page/[token]/route.ts`. The BFF absorbs wire
 * differences so no component ever learns the backend's field names.
 */

import type { Artifact, InlineCard } from '@/types/artifact.types';
import type {
  SubmitResult,
  Thread,
  ThreadSummary,
  Turn,
  TurnRole,
  TurnStatus,
} from '@/types/thread.types';

type Raw = Record<string, unknown>;

const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' && v ? v : fallback;

const num = (v: unknown, fallback = 0): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

/** Django `senderKind` → the two roles the transcript renders. */
function toRole(senderKind: unknown): TurnRole {
  const kind = str(senderKind, 'agent');
  return kind === 'visitor' || kind === 'client' ? 'visitor' : 'itrix';
}

/**
 * Django `streamingStatus` + `underReview` → `TurnStatus`.
 *
 * `underReview` wins over the streaming status. A message held by governance is
 * under review whatever the stream did, and treating it as settled would render
 * an empty bubble with no explanation.
 */
function toStatus(raw: Raw): TurnStatus {
  if (raw.underReview === true) return 'under_review';
  const s = str(raw.streamingStatus, 'settled');
  const known: TurnStatus[] = [
    'pending', 'streaming', 'settled', 'under_review', 'halted', 'unavailable',
  ];
  return (known as string[]).includes(s) ? (s as TurnStatus) : 'settled';
}

export function toTurn(raw: unknown, threadId: string): Turn {
  const r = (raw ?? {}) as Raw;
  return {
    id: str(r.id) || `srv_${Math.random().toString(36).slice(2, 10)}`,
    threadId,
    role: toRole(r.senderKind),
    body: str(r.body),
    seq: num(r.seq),
    status: toStatus(r),
    createdAt: str(r.at) || str(r.createdAt) || new Date().toISOString(),
    // Never dropped: if material content could not be considered, the turn says
    // so plainly rather than presenting a partial answer as complete (§2.4).
    contextNote: str(r.contextNote) || null,
  };
}

export function toThreadSummary(raw: unknown): ThreadSummary {
  const r = (raw ?? {}) as Raw;
  const activity = str(r.lastActivityAt) || new Date().toISOString();
  return {
    id: str(r.threadId) || str(r.id),
    title: str(r.title, 'New review'),
    // Django's summary carries no createdAt. Falling back to lastActivityAt
    // keeps the sidebar's ordering sane rather than leaving it undefined.
    createdAt: str(r.createdAt) || activity,
    lastActivityAt: activity,
  };
}

/**
 * One artifact from the wire.
 *
 * DEFENSIVE ON EVERY FIELD, for one reason: an artifact whose `governanceStatus` is
 * missing must NOT default to approved. Any unrecognised value resolves to
 * `under_review`, which renders nothing — the frontend cannot display ungoverned
 * content, and a normaliser that guessed "probably fine" would be the one place that
 * rule could be quietly broken (Architecture v2.7 §19).
 */
export function toArtifact(raw: unknown, threadId: string): Artifact {
  const r = (raw ?? {}) as Raw;
  const status = str(r.governanceStatus);
  return {
    id: str(r.id) || str(r.artifactId),
    threadId: str(r.threadId) || threadId,
    type: str(r.type) as Artifact['type'],
    version: num(r.version, 1),
    payload: (r.payload && typeof r.payload === 'object' ? r.payload : {}) as Record<string, unknown>,
    disclosureLevel: (str(r.disclosureLevel) || 'public') as Artifact['disclosureLevel'],
    governanceStatus:
      status === 'approved' || status === 'blocked' ? status : 'under_review',
    capabilityToken: str(r.capabilityToken) || null,
    seq: num(r.seq),
    createdAt: str(r.createdAt) || str(r.at) || new Date().toISOString(),
  };
}

/**
 * One inline card from the wire.
 *
 * ONE ACTION PER CARD (Playbook v1.7 §16G). If the backend ever sends an array, only
 * the first is taken rather than rendering a list of offers — a card carrying several
 * asks is a defect, and normalising it into a single action is the cheapest place to
 * refuse it.
 */
export function toInlineCard(raw: unknown, threadId: string): InlineCard {
  const r = (raw ?? {}) as Raw;
  const rawAction = Array.isArray(r.actions) ? r.actions[0] : r.action;
  const a = (rawAction ?? null) as Raw | null;
  return {
    id: str(r.id) || str(r.cardId),
    threadId: str(r.threadId) || threadId,
    type: str(r.type) as InlineCard['type'],
    title: str(r.title),
    body: str(r.body) || null,
    action: a && str(a.label)
      ? { label: str(a.label), href: str(a.href) || null, commercial: a.commercial === true }
      : null,
    payload: (r.payload && typeof r.payload === 'object' ? r.payload : undefined) as
      | Record<string, unknown>
      | undefined,
    seq: num(r.seq),
    createdAt: str(r.createdAt) || str(r.at) || new Date().toISOString(),
  };
}

export function toThread(raw: unknown): Thread {
  const r = (raw ?? {}) as Raw;
  const summary = toThreadSummary(r);
  const turns = Array.isArray(r.turns) ? r.turns : [];
  /* v6.0 PHASE 2: artifacts and cards were being DROPPED here. `useArtifacts` read
     them off the thread payload through a cast, so it always received undefined and
     the transcript rendered no artifacts and no cards at all — silently, because the
     cast suppressed the type error that would have caught it. The content pane's
     whole input is artifacts, so this is a prerequisite rather than an improvement. */
  const artifacts = Array.isArray(r.artifacts) ? r.artifacts : [];
  const cards = Array.isArray(r.cards) ? r.cards : [];
  return {
    ...summary,
    turns: turns.map((t) => toTurn(t, summary.id)),
    artifacts: artifacts.map((a) => toArtifact(a, summary.id)).filter((a) => a.id && a.type),
    cards: cards.map((c) => toInlineCard(c, summary.id)).filter((c) => c.id && c.type),
  };
}

/**
 * Django thread-detail (from POST /threads/) → `SubmitResult`.
 *
 * The backend returns the whole thread; the composer needs the thread summary
 * plus the visitor's own turn so it can reconcile its optimistic copy.
 */
export function toSubmitResult(raw: unknown): SubmitResult {
  const thread = toThread(raw);
  const visitorTurns = thread.turns.filter((t) => t.role === 'visitor');
  const itrixTurns = thread.turns.filter((t) => t.role === 'itrix');

  return {
    thread: {
      id: thread.id,
      title: thread.title,
      createdAt: thread.createdAt,
      lastActivityAt: thread.lastActivityAt,
    },
    visitorTurn:
      visitorTurns[visitorTurns.length - 1] ??
      toTurn({ senderKind: 'visitor', seq: 1 }, thread.id),
    itrixTurn: itrixTurns[itrixTurns.length - 1] ?? null,
    degraded: false,
  };
}

/**
 * Django turn-submit (from POST /threads/{id}/turns/) → `SubmitResult`.
 *
 * That endpoint returns `{ threadId, turn, assistantTurn }` rather than a whole
 * thread. `assistantTurn` is null in Phase 1 — the assistant reply arrives over
 * the socket — and the backend says so honestly rather than implying one is
 * coming down this response.
 */
export function toTurnSubmitResult(raw: unknown, fallbackThreadId: string): SubmitResult {
  const r = (raw ?? {}) as Raw;
  const threadId = str(r.threadId) || fallbackThreadId;
  const visitorTurn = toTurn(r.turn, threadId);

  return {
    thread: {
      id: threadId,
      title: '',
      createdAt: visitorTurn.createdAt,
      lastActivityAt: visitorTurn.createdAt,
    },
    visitorTurn,
    itrixTurn: r.assistantTurn ? toTurn(r.assistantTurn, threadId) : null,
    degraded: false,
  };
}

export function toThreadList(raw: unknown): ThreadSummary[] {
  const r = (raw ?? {}) as Raw;
  const list = Array.isArray(r.threads) ? r.threads : [];
  return list.map(toThreadSummary).filter((t) => t.id);
}
