/**
 * Typed client for the customized client page + its embedded chat.
 *   GET  /api/client-page/[token]        → ClientPage
 *   POST /api/client-page/[token]/chat   → ChatReply (a full ChatMessage, or under-review)
 * Never throws — returns { data } or { error }.
 */

import type { ClientPage } from '@/types/client.types';
import type { ChatMessage, Citation } from '@/types/chat.types';
import type { ApiResult } from './journeyApi';

/** The proxy returns either a full message, or a held-for-review marker. */
export interface ChatReply {
  message: ChatMessage | null;
  underReview: boolean;
}

type AnyRec = Record<string, unknown>;

function coerceMessage(raw: AnyRec): ChatMessage {
  const citations: Citation[] = Array.isArray(raw.citations) ? (raw.citations as Citation[]) : [];
  return {
    id: typeof raw.id === 'string' ? raw.id : `a-${Date.now().toString(36)}`,
    conversationId: typeof raw.conversationId === 'string' ? raw.conversationId : '',
    senderKind: 'agent',
    agentKey: typeof raw.agentKey === 'string' ? raw.agentKey : 'concierge',
    body: typeof raw.body === 'string' ? raw.body : '',
    citations,
    governanceStatus:
      raw.governanceStatus === 'pending' ||
      raw.governanceStatus === 'approved' ||
      raw.governanceStatus === 'blocked' ||
      raw.governanceStatus === 'auto_approved'
        ? raw.governanceStatus
        : 'auto_approved',
    streaming: false,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  };
}

function toChatReply(raw: AnyRec): ChatReply {
  if (raw.underReview === true) return { message: null, underReview: true };
  return { message: coerceMessage(raw), underReview: false };
}

export const clientPageApi = {
  async get(token: string): Promise<ApiResult<ClientPage>> {
    try {
      const res = await fetch(`/api/client-page/${encodeURIComponent(token)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `client-page ${res.status}` };
      const data = (await res.json()) as ClientPage;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'client-page unreachable' };
    }
  },

  async sendChat(token: string, body: string, conversationId: string | null): Promise<ApiResult<ChatReply>> {
    try {
      const res = await fetch(`/api/client-page/${encodeURIComponent(token)}/chat`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ body, conversationId }),
      });
      if (!res.ok) return { data: null, error: `client-page chat ${res.status}` };
      const raw = (await res.json()) as AnyRec;
      return { data: toChatReply(raw), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'chat unreachable' };
    }
  },
};

/** Review-chat client (Concierge turns) — POST /api/review/[id]/chat. */
export const reviewChatApi = {
  async send(sessionId: string, body: string): Promise<ApiResult<ChatReply>> {
    try {
      const res = await fetch(`/api/review/${encodeURIComponent(sessionId)}/chat`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) return { data: null, error: `review chat ${res.status}` };
      const raw = (await res.json()) as AnyRec;
      return { data: toChatReply(raw), error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'chat unreachable' };
    }
  },
};
