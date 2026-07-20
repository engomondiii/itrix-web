/**
 * The conversation spine — client-side mirror of apps.conversations (Backend v6.0 §2).
 *
 * A THREAD is the conversation. A TURN is one contribution to it. Everything the
 * visitor does from their first sentence to State 10 happens inside one thread,
 * which is why this file — not the review store — is the shape the surface reads.
 *
 * The backend owns threads. Nothing here mints authority: no field in this file
 * decides what a visitor may see, and a turn's `status` is reported by the
 * server, never inferred from how the UI feels about it.
 *
 * Surface 1 v5.0 §3 · Architecture v2.6 §2.5
 */

/** Who produced a turn. Deliberately not "user"/"assistant" — this is not a chatbot. */
export type TurnRole = 'visitor' | 'itrix';

/**
 * The lifecycle of a turn, as the SERVER reports it.
 *
 *   pending       accepted, nothing generated yet
 *   streaming     tokens are arriving                       (Phase 2)
 *   settled       generation finished and governance passed
 *   under_review  governance held it; approved wording shown (Phase 2)
 *   halted        the stream guard stopped it mid-flight     (Phase 2)
 *   unavailable   we could not reach itriX for this turn — an honest local state,
 *                 never a fabricated answer
 *
 * Phase 1 uses `pending`, `settled` and `unavailable`. The rest are typed now so
 * the contract is settled before Phase 2 renders them.
 */
export type TurnStatus =
  | 'pending'
  | 'streaming'
  | 'settled'
  | 'under_review'
  | 'halted'
  | 'unavailable';

export interface Turn {
  id: string;
  threadId: string;
  role: TurnRole;
  /** The visible text. Empty while a turn is pending or streaming. */
  body: string;
  /**
   * Monotonic per thread. Ordering and gap detection both key off this, so it is
   * required rather than optional — a turn with no sequence cannot be placed.
   */
  seq: number;
  status: TurnStatus;
  createdAt: string;
  /**
   * Set when the server could not consider some material (Backend v6.0 §2.4).
   * Rendered plainly rather than hidden: the visitor is told what was left out.
   */
  contextNote?: string | null;
}

/** What the sidebar's conversation list needs. Never carries transcript text. */
export interface ThreadSummary {
  id: string;
  /**
   * Generated from the first exchange, renameable. Inherits the no-inference
   * rule: a title may never name an inferred company, department or persona.
   */
  title: string;
  createdAt: string;
  lastActivityAt: string;
}

export interface Thread extends ThreadSummary {
  turns: Turn[];
}

/** POST /api/threads — the payload the surface sends to open a conversation. */
export interface CreateThreadRequest {
  /**
   * The visitor's first sentence. It becomes turn 1 of the thread — it is never
   * re-asked (R12), which is why the create call carries it rather than a
   * separate "start" step.
   */
  body: string;
  /**
   * The functional family behind a chosen example chip, when one was used
   * verbatim. A ROUTING PRIOR for the backend, never a conclusion and never
   * rendered back to the visitor.
   */
  familyPrior?: string | null;
  /** PHASE 2: attachments staged before the thread existed travel with turn 1. */
  attachmentIds?: string[];
}

/** POST /api/threads/[id]/turns — a subsequent turn in an open thread. */
export interface CreateTurnRequest {
  body: string;
  /** Phase 2. Present in the contract now so the proxy shape does not change. */
  attachmentIds?: string[];
}

/**
 * What a submit returns.
 *
 * `degraded` is true when the backend could not be reached and the surface fell
 * back to local-only behaviour. It exists so the UI can be honest about it
 * instead of silently pretending the turn was received.
 */
export interface SubmitResult {
  thread: ThreadSummary;
  visitorTurn: Turn;
  /** Present only when the backend already had something to say. */
  itrixTurn?: Turn | null;
  degraded: boolean;
}
