/** Tokenless client for a completed My Review and its governed follow-up chat. */
import type { ClientPage } from '@/types/client.types';
import type { ChatMessage, Citation } from '@/types/chat.types';
import type { ApiResult } from './journeyApi';

export interface ChatReply { message: ChatMessage | null; underReview: boolean; }
type AnyRec = Record<string, unknown>;

function coerceMessage(raw: AnyRec): ChatMessage {
  const citations: Citation[] = Array.isArray(raw.citations) ? (raw.citations as Citation[]) : [];
  return {
    id: typeof raw.id === 'string' ? raw.id : `a-${Date.now().toString(36)}`,
    conversationId: typeof raw.conversationId === 'string' ? raw.conversationId : '',
    senderKind: 'agent',
    agentKey: typeof raw.agentKey === 'string' ? raw.agentKey : 'concierge',
    body: typeof raw.body === 'string' ? raw.body : typeof raw.reply === 'string' ? raw.reply : '',
    citations,
    governanceStatus:
      raw.governanceStatus === 'pending' || raw.governanceStatus === 'approved' ||
      raw.governanceStatus === 'blocked' || raw.governanceStatus === 'auto_approved'
        ? raw.governanceStatus : 'auto_approved',
    streaming: false,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  };
}
function toChatReply(raw: AnyRec): ChatReply {
  if (raw.underReview === true) return { message: null, underReview: true };
  return { message: coerceMessage(raw), underReview: false };
}

export const clientPageApi = {
  async getCurrent(): Promise<ApiResult<ClientPage>> {
    try {
      const res = await fetch('/api/client-page/current', { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!res.ok) return { data: null, error: `client-page ${res.status}` };
      return { data: (await res.json()) as ClientPage, error: null };
    } catch (e) { return { data: null, error: e instanceof Error ? e.message : 'client-page unreachable' }; }
  },
  async sendChat(body: string, conversationId: string | null): Promise<ApiResult<ChatReply>> {
    try {
      const res = await fetch('/api/client-page/current/chat', {
        method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ body, conversationId }),
      });
      if (!res.ok) return { data: null, error: `client-page chat ${res.status}` };
      return { data: toChatReply((await res.json()) as AnyRec), error: null };
    } catch (e) { return { data: null, error: e instanceof Error ? e.message : 'chat unreachable' }; }
  },
};

export const reviewChatApi = {
  async send(sessionId: string, body: string): Promise<ApiResult<ChatReply>> {
    try {
      const res = await fetch(`/api/review/${encodeURIComponent(sessionId)}/chat`, {
        method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ body }),
      });
      if (!res.ok) return { data: null, error: `review chat ${res.status}` };
      return { data: toChatReply((await res.json()) as AnyRec), error: null };
    } catch (e) { return { data: null, error: e instanceof Error ? e.message : 'chat unreachable' }; }
  },
};
