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

export function toThread(raw: unknown): Thread {
  const r = (raw ?? {}) as Raw;
  const summary = toThreadSummary(r);
  const turns = Array.isArray(r.turns) ? r.turns : [];
  return { ...summary, turns: turns.map((t) => toTurn(t, summary.id)) };
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
