/**
 * Typed WebSocket event map (Architecture §12 — realtime layer).
 *
 * The same event vocabulary is used across all three socket contexts (review,
 * client page, portal). Server → client events carry a `type` discriminator and a
 * `payload`; client → server events are the small set the UI can emit. Keeping the
 * map here means every socket consumer shares one contract.
 *
 * v4.0.3: adds `clientpage.delta` / `clientpage.final` so the customized client page can
 * render its generation live (token-by-token) instead of polling for a background swap.
 */

import type { ChatMessage, Citation, GovernanceStatus } from '@/types/chat.types';
import type {
  JourneyState, RevealSurface, JourneyReveal, RailsPayload,
  IdentityState, DisclosureCeiling, StateKey,
} from '@/types/journey.types';
import type { ClientPage } from '@/types/client.types';

/** ---- Server → client payloads ---- */

/** A streamed chunk of an in-flight agent message. */
export interface MessageDeltaPayload {
  conversationId: string;
  messageId: string;
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

/** A journey reveal pushed the instant the backend authorizes a surface. */
export interface JourneyRevealPayload {
  state: JourneyState;
  /** v4.0: the 1–10 number and stable key travel with every reveal. */
  journeyNumber?: number | null;
  stateKey?: StateKey;
  identityState?: IdentityState;
  disclosureCeiling?: DisclosureCeiling;
  authorizedSurface: RevealSurface | null;
  reveal: JourneyReveal;
  valueDelivered: boolean;
  accountInviteAvailable: boolean;
  /** Reveals often change what the rails may show, so they may carry them. */
  rails?: RailsPayload;
}

/**
 * The backend RE-AUTHORIZED the rails (Architecture v2.5 Appendix A).
 *
 * The lists are absolute, not a delta: a section the backend drops must
 * disappear from the UI. Consumers replace rather than merge.
 */
export interface RailUpdatePayload {
  journeyState?: JourneyState;
  journeyNumber?: number | null;
  rails: RailsPayload;
}

/**
 * A support request changed state (Architecture v2.5 Appendix A).
 *
 * Typed here in Phase 2 so the contract is settled; the customer-success
 * surfaces that consume it arrive in Phase 3.
 */
export interface SupportUpdatePayload {
  requestId: string;
  status: 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved';
  owner?: string | null;
  slaDueAt?: string | null;
}

/** A streamed chunk of the client-page narrative as it generates (live). */
export interface ClientPageDeltaPayload {
  /** Which page field is streaming (currently "problemMirror"). */
  field: string;
  delta: string;
}

/** The fully-assembled client page, sent once generation completes. */
export interface ClientPageFinalPayload {
  page: ClientPage;
}

/** Presence in a portal conversation (who from the team is here). */
export interface PresenceUpdatePayload {
  conversationId: string;
  present: string[]; // team member display names
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
  | { type: 'journey.reveal'; payload: JourneyRevealPayload }
  | { type: 'rail.update'; payload: RailUpdatePayload }
  | { type: 'support.update'; payload: SupportUpdatePayload }
  | { type: 'clientpage.delta'; payload: ClientPageDeltaPayload }
  | { type: 'clientpage.final'; payload: ClientPageFinalPayload }
  | { type: 'presence.update'; payload: PresenceUpdatePayload }
  | { type: 'team.typing'; payload: TeamTypingPayload }
  | { type: 'pong'; payload: Record<string, never> };

export type ServerEventType = ServerEvent['type'];

/** ---- Client → server events ---- */
export type ClientEvent =
  | { type: 'chat.send'; payload: { conversationId: string; body: string } }
  | { type: 'chat.typing'; payload: { conversationId: string; typing: boolean } }
  | { type: 'subscribe'; payload: { channel: string } }
  | { type: 'ping'; payload: Record<string, never> };

/** Handler map for consumers: partial set of typed callbacks. */
export type ServerEventHandlers = {
  [E in ServerEvent as E['type']]?: (payload: E['payload']) => void;
};

export type { Citation };
