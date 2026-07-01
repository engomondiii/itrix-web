/**
 * Typed client for the customized client page + its embedded chat.
 *   GET  /api/client-page/[token]        → ClientPage
 *   POST /api/client-page/[token]/chat   → ChatMessage (the agent reply, governed)
 * Never throws — returns { data } or { error }.
 */

import type { ClientPage } from '@/types/client.types';
import type { ChatMessage } from '@/types/chat.types';
import type { ApiResult } from './journeyApi';

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

  async sendChat(token: string, body: string, conversationId: string | null): Promise<ApiResult<ChatMessage>> {
    try {
      const res = await fetch(`/api/client-page/${encodeURIComponent(token)}/chat`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ body, conversationId }),
      });
      if (!res.ok) return { data: null, error: `client-page chat ${res.status}` };
      const data = (await res.json()) as ChatMessage;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'chat unreachable' };
    }
  },
};

/** Review-chat client (Concierge turns) — POST /api/review/[id]/chat. */
export const reviewChatApi = {
  async send(sessionId: string, body: string): Promise<ApiResult<ChatMessage>> {
    try {
      const res = await fetch(`/api/review/${encodeURIComponent(sessionId)}/chat`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) return { data: null, error: `review chat ${res.status}` };
      const data = (await res.json()) as ChatMessage;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'chat unreachable' };
    }
  },
};
