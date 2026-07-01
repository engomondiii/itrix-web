/**
 * Governed conversation — client-side mirror of the backend apps.conversations model.
 * Three contexts share one shape: review (anonymous), client_page (token), portal (client).
 */

export type ChatContext = 'review' | 'client_page' | 'portal';

/** Who authored a message. The assessment intelligence is never a named person. */
export type SenderKind = 'client' | 'agent' | 'team';

/** Governance status carried by every message (mirrors backend governance_status). */
export type GovernanceStatus = 'auto_approved' | 'pending' | 'approved' | 'blocked';

/** A cited Knowledge Core chunk surfaced with an agent message. */
export interface Citation {
  chunkId: string;
  label?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderKind: SenderKind;
  /** Present for agent messages (e.g. "concierge", "diagnosis"). */
  agentKey?: string | null;
  body: string;
  citations: Citation[];
  governanceStatus: GovernanceStatus;
  /** True while tokens are still streaming into this message (Phase 3). */
  streaming?: boolean;
  createdAt: string;
}

/** Local thread state held in the chat store, keyed by conversationId. */
export interface ChatThreadState {
  conversationId: string;
  context: ChatContext;
  messages: ChatMessage[];
  /** A partial message currently being streamed / awaited. */
  pending: boolean;
  /** True when the latest reply is held for human approval ("under review"). */
  underReview: boolean;
  error: string | null;
}
