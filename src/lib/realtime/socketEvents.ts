/**
 * Typed WebSocket event map (Architecture v2.6 §14.3).
 *
 * The same event vocabulary is used across the remaining socket contexts (review and
 * portal). My Review deliberately has no bearer-token WebSocket transport. Server → client events carry a `type` discriminator and a
 * `payload`; client → server events are the small set the UI can emit. Keeping
 * the map here means every socket consumer shares one contract.
 *
 * v5.0 CHANGES
 *   · `rail.update` is REMOVED. `shell.update` supersedes it and carries the
 *     sidebar sections, the conversation header and the composer label — the
 *     right value rail is retired and the left rail became navigation.
 *   · `message.delta` gains a monotonic `seq` for ordering, gap detection and
 *     resume.
 *   · `thread.updated` is added so the sidebar list re-orders live.
 *   · `turn.submit` / `turn.cancel` are added to the client → server set.
 *
 * Phase 1 uses `shell.update` and `thread.updated`. The streaming events are
 * typed now so the contract is settled before Phase 2 renders them.
 */

import type { ChatMessage, Citation, GovernanceStatus } from '@/types/chat.types';
import type {
  JourneyState, RevealSurface, JourneyReveal,
  IdentityState, DisclosureCeiling, StateKey,
} from '@/types/journey.types';
import type { ShellContractPayload } from '@/types/shell.types';
import type { AttachmentErrorCode, AttachmentStatus } from '@/types/attachment.types';
import type { ArtifactType } from '@/lib/journey/artifactTypes';
import type { ThreadSummary } from '@/types/thread.types';

/** ---- Server → client payloads ---- */

/** A streamed chunk of an in-flight agent message. */
export interface MessageDeltaPayload {
  conversationId: string;
  messageId: string;
  /**
   * MONOTONIC PER THREAD (Architecture v2.6 §14.4).
   *
   * Ordering and gap detection both key off this. A client that detects a gap
   * re-fetches the message rather than rendering a hole, and a reconnect resumes
   * from the last acknowledged sequence.
   */
  seq: number;
  /** The incremental text chunk to append. */
  delta: string;
  senderKind: 'agent' | 'team';
  agentKey?: string | null;
}

/** The finalized message (replaces any streamed buffer for messageId). */
export interface MessageFinalPayload {
  conversationId: string;
  message: ChatMessage;
}

/** A reply held for human approval — the UI shows the "under review" state. */
export interface MessageUnderReviewPayload {
  conversationId: string;
  messageId: string;
  governanceStatus: Extract<GovernanceStatus, 'pending' | 'blocked'>;
}

/**
 * The stream guard stopped a response mid-flight (Architecture v2.6 §19.8).
 *
 * The client DISCARDS the partial text. It is never left on screen, because
 * partial text that tripped a prohibited pattern is exactly the text that must
 * not be read.
 */
export interface MessageHaltedPayload {
  conversationId: string;
  messageId: string;
  reason?: string | null;
}

/** A journey reveal pushed the instant the backend authorizes a surface. */
export interface JourneyRevealPayload {
  state: JourneyState;
  journeyNumber?: number | null;
  stateKey?: StateKey;
  identityState?: IdentityState;
  disclosureCeiling?: DisclosureCeiling;
  authorizedSurface: RevealSurface | null;
  reveal: JourneyReveal;
  valueDelivered: boolean;
  accountInviteAvailable: boolean;
  /** A reveal often changes what the shell may show, so it may carry it. */
  shell?: ShellContractPayload;
}

/**
 * The backend RE-AUTHORIZED the shell (Architecture v2.6 Appendix A).
 *
 * REPLACES `rail.update`. It carries sidebar sections, the conversation header
 * and the composer label.
 *
 * The section list is ABSOLUTE, not a delta: a section the backend drops must
 * disappear from the UI. Consumers replace rather than merge.
 */
export interface ShellUpdatePayload extends ShellContractPayload {
  /** Legacy numeric alias retained for the remaining realtime consumers. */
  journeyNumber?: number | null;
}

/**
 * The next question the platform wants to ask (Architecture v2.6 §3.1).
 *
 * The DIVISION OF AUTHORITY matters more than the payload: a deterministic
 * coverage tracker and stop rule decide WHETHER to ask, and the model decides
 * only the WORDING — bound to Claim-Card level 1, so it may ask and never
 * assert, and never reveals an inference.
 *
 * `primary` closes the assistant turn. `chips` render above the composer and
 * POPULATE it; they never submit.
 */
export interface QuestionSuggestedPayload {
  threadId: string;
  primary?: string;
  chips: string[];
}

/**
 * A governed artifact is ready (Architecture v2.6 §14.3).
 *
 * The event carries a REFERENCE, not the content. The client fetches it, which
 * means the server re-authorizes the read — the socket never delivers a payload
 * that bypassed the disclosure check.
 */
export interface ArtifactReadyPayload {
  threadId: string;
  artifactId: string;
  type: ArtifactType;
  disclosureLevel?: string;
  /**
   * v7.0. Whether the backend intends this artifact to be focused in the content
   * pane on delivery (Architecture v2.7 §14.3).
   *
   * IT IS A HINT, NOT AN INSTRUCTION. The client focuses the pane only when the pane
   * is already visible, and a reveal NEVER forces the pane open on a narrow
   * breakpoint (§11.5) — the reference card expands inline instead. A server that
   * could open an overlay on a phone would be deciding the visitor's layout.
   */
  openInPane?: boolean;
}

/**
 * WHICH PIPELINE STAGE A PENDING TURN IS AT (Architecture v2.7 §14.3, Backend v7.0 §5).
 *
 * Emitted from the REAL transitions — retrieval starts, the first generation call,
 * the settle pipeline starts — and NEVER on a timer. If a stage cannot be determined
 * the backend sends nothing, and the client holds its current label rather than
 * inventing the next one.
 *
 * The event carries the enum; the WORDING lives on the frontend in
 * lib/content/pendingCopy.ts, so the three approved strings have one home and a
 * backend change cannot silently reword what the visitor reads.
 */
export interface MessageStagePayload {
  threadId: string;
  messageId?: string;
  stage: 'retrieving' | 'composing' | 'checking';
}

/**
 * An attachment moved through scan and extraction (Backend v6.0 §4.3).
 *
 * Scanning strictly precedes extraction, so the status sequence a client can
 * observe is staged → scanning → extracting → ready | opaque | quarantined.
 *
 * `opaque` is a SUCCESS state: the file was accepted and stored, we simply could
 * not read inside it. It must never be presented as a failure.
 */
export interface AttachmentStatusPayload {
  attachmentId: string;
  status: AttachmentStatus;
  errorCode?: AttachmentErrorCode | null;
  error?: string | null;
}

/**
 * A thread was created, renamed or touched — the sidebar list re-orders.
 *
 * THE WIRE SHAPE IS FLAT. `fan_out.broadcast_thread_updated` sends
 * `{threadId, title, state, claimed}` at the top level, NOT a nested `thread`
 * object. This interface used to declare the nested shape, so the handler read
 * `p.thread?.id`, found undefined, and dropped every frame — which is why a
 * newly-created conversation showed only "4m ago" in the rail until a full
 * reload: the generated title was broadcast and then thrown away.
 *
 * `thread` is kept as an optional field so a future nested sender still works.
 */
export interface ThreadUpdatedPayload {
  threadId?: string;
  title?: string;
  state?: string;
  claimed?: boolean;
  thread?: ThreadSummary;
}

/** A support request changed state (Architecture v2.6 Appendix A). */
export interface SupportUpdatePayload {
  requestId: string;
  status: 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved';
  owner?: string | null;
  slaDueAt?: string | null;
}

/** Presence in a portal conversation (who from the team is here). */
export interface PresenceUpdatePayload {
  conversationId: string;
  present: string[];
}

/** A team member is typing in a portal conversation. */
export interface TeamTypingPayload {
  conversationId: string;
  name: string;
  typing: boolean;
}

/** The discriminated union of all server → client events. */
export type ServerEvent =
  | { type: 'message.delta'; payload: MessageDeltaPayload }
  | { type: 'message.final'; payload: MessageFinalPayload }
  | { type: 'message.under_review'; payload: MessageUnderReviewPayload }
  | { type: 'message.halted'; payload: MessageHaltedPayload }
  | { type: 'journey.reveal'; payload: JourneyRevealPayload }
  | { type: 'shell.update'; payload: ShellUpdatePayload }
  | { type: 'thread.updated'; payload: ThreadUpdatedPayload }
  | { type: 'question.suggested'; payload: QuestionSuggestedPayload }
  | { type: 'artifact.ready'; payload: ArtifactReadyPayload }
  | { type: 'message.stage'; payload: MessageStagePayload }
  | { type: 'attachment.status'; payload: AttachmentStatusPayload }
  | { type: 'support.update'; payload: SupportUpdatePayload }
  | { type: 'presence.update'; payload: PresenceUpdatePayload }
  | { type: 'team.typing'; payload: TeamTypingPayload }
  | { type: 'pong'; payload: Record<string, never> };

export type ServerEventType = ServerEvent['type'];

/** ---- Client → server events ---- */
export type ClientEvent =
  /** v5.0: a turn in a thread. Phase 2 sends this instead of chat.send. */
  | { type: 'turn.submit'; payload: { threadId: string; body: string; attachmentIds?: string[] } }
  | { type: 'turn.cancel'; payload: { threadId: string; messageId: string } }
  /**
   * v7.0. Scope the socket to the thread the visitor is actually looking at, so
   * deltas for a background thread are not fanned out to a client that cannot render
   * them (Architecture v2.7 §14.3).
   *
   * IT IS NOT AUTHORIZATION. The consumer still verifies that the session owns the
   * thread; this only narrows what gets sent.
   */
  | { type: 'thread.select'; payload: { threadId: string } }
  | { type: 'chat.send'; payload: { conversationId: string; body: string } }
  | { type: 'chat.typing'; payload: { conversationId: string; typing: boolean } }
  | { type: 'subscribe'; payload: { channel: string } }
  | { type: 'ping'; payload: Record<string, never> };

/** Handler map for consumers: partial set of typed callbacks. */
export type ServerEventHandlers = {
  [E in ServerEvent as E['type']]?: (payload: E['payload']) => void;
};

export type { Citation };
