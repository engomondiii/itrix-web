/**
 * Typed WebSocket event map (Architecture §12 — realtime layer).
 *
 * The same event vocabulary is used across all three socket contexts (review,
 * client page, portal). Server → client events carry a `type` discriminator and a
 * `payload`; client → server events are the small set the UI can emit. Keeping the
 * map here means every socket consumer shares one contract.
 */

import type { ChatMessage, Citation, GovernanceStatus } from '@/types/chat.types';
import type { JourneyState, RevealSurface, JourneyReveal } from '@/types/journey.types';

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
  authorizedSurface: RevealSurface | null;
  reveal: JourneyReveal;
  valueDelivered: boolean;
  accountInviteAvailable: boolean;
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
