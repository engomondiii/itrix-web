import type { ChatMessage, Citation, GovernanceStatus, SenderKind } from '@/types/chat.types';
import type { PortalThread } from '@/types/portal.types';

type Raw = Record<string, unknown>;

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);

function sender(v: unknown): SenderKind {
  if (v === 'client' || v === 'team' || v === 'agent') return v;
  if (v === 'visitor') return 'client';
  return 'agent';
}

function governance(v: unknown): GovernanceStatus {
  return v === 'pending' || v === 'approved' || v === 'blocked' || v === 'auto_approved'
    ? v
    : 'auto_approved';
}

function citations(v: unknown): Citation[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (typeof item === 'string') return item ? { chunkId: item } : null;
      const row = (item ?? {}) as Raw;
      const chunkId = str(row.chunkId) || str(row.chunk_id);
      return chunkId ? { chunkId, label: str(row.label) || undefined } : null;
    })
    .filter((item): item is Citation => item !== null);
}

/**
 * Django's client-plane MessageSerializer predates ChatMessage and emits
 * `citedChunkIds` + `at`.  The browser contract is deliberately stricter:
 * `citations` is ALWAYS an array and `createdAt` is ALWAYS present.  Normalise at
 * the BFF boundary so renderers never have to know which serializer produced a
 * message (and, in particular, can never crash on `m.citations.length`).
 */
export function toPortalChatMessage(raw: unknown, conversationId: string): ChatMessage {
  const r = (raw ?? {}) as Raw;
  const attachments = Array.isArray(r.attachments) ? r.attachments : [];
  return {
    id: str(r.id) || `msg-${Date.now().toString(36)}`,
    conversationId: str(r.conversationId) || str(r.conversation_id) || conversationId,
    senderKind: sender(r.senderKind ?? r.sender_kind),
    agentKey: str(r.agentKey ?? r.agent_key) || null,
    body: str(r.body),
    citations: citations(r.citations ?? r.citedChunkIds ?? r.cited_chunk_ids),
    governanceStatus: governance(r.governanceStatus ?? r.governance_status),
    streaming: r.streaming === true,
    createdAt: str(r.createdAt) || str(r.at) || new Date().toISOString(),
    attachments: attachments as ChatMessage['attachments'],
  };
}

/** Django ConversationThreadSerializer -> Surface-1 PortalThread. */
export function toPortalThread(raw: unknown, fallbackConversationId = ''): PortalThread {
  const r = (raw ?? {}) as Raw;
  const conversationId = str(r.conversationId) || str(r.id) || fallbackConversationId;
  const messages = Array.isArray(r.messages) ? r.messages : [];
  return {
    conversationId,
    threadId: str(r.threadId ?? r.thread_id) || null,
    messages: messages.map((m) => toPortalChatMessage(m, conversationId)),
    teamJoined: r.teamJoined === true,
    teamMemberName: str(r.teamMemberName) || null,
  };
}
