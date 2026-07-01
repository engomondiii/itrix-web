'use client';

import { useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { clientPageApi, reviewChatApi } from '@/lib/api/clientPageApi';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import type { ChatContext, ChatMessage } from '@/types/chat.types';
import type { MessageDeltaPayload, MessageFinalPayload, MessageUnderReviewPayload } from '@/lib/realtime/socketEvents';

function localId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface UseAgentChatArgs {
  context: ChatContext;
  conversationId: string;
  /** For client_page context: the capability token. */
  token?: string;
  /** For review context: the review session id. */
  sessionId?: string;
}

/**
 * Embedded governed chat for a single conversation.
 *
 * Phase 3: when realtime is ON, the agent reply streams over the socket
 * (message.delta → message.final), and a held reply arrives as message.under_review.
 * When realtime is OFF (or the socket isn't open), it falls back to the Phase 1
 * request/response POST — identical public surface, same "under review" safety state.
 */
export function useAgentChat({ context, conversationId, token, sessionId }: UseAgentChatArgs) {
  const ensureThread = useChatStore((s) => s.ensureThread);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const upsertStreaming = useChatStore((s) => s.upsertStreaming);
  const setPending = useChatStore((s) => s.setPending);
  const setUnderReview = useChatStore((s) => s.setUnderReview);
  const setError = useChatStore((s) => s.setError);
  const thread = useChatStore((s) => s.threads[conversationId]);

  ensureThread(conversationId, context);

  const realtime = siteConfig.featureFlags.realtime && (context === 'client_page' || context === 'review');
  const socketUrl =
    context === 'client_page' && token
      ? wsUrls.clientPage(token)
      : context === 'review' && sessionId
        ? wsUrls.review(sessionId)
        : null;

  const { connected, send: socketSend } = useSocket({
    url: socketUrl,
    token: context === 'client_page' ? token : sessionId,
    enabled: realtime && Boolean(socketUrl),
    handlers: {
      'message.delta': (p: MessageDeltaPayload) => {
        const existing = useChatStore.getState().threads[p.conversationId]?.messages.find((m) => m.id === p.messageId);
        const merged: ChatMessage = existing
          ? { ...existing, body: existing.body + p.delta, streaming: true }
          : {
              id: p.messageId,
              conversationId: p.conversationId,
              senderKind: p.senderKind,
              agentKey: p.agentKey ?? null,
              body: p.delta,
              citations: [],
              governanceStatus: 'auto_approved',
              streaming: true,
              createdAt: new Date().toISOString(),
            };
        upsertStreaming(p.conversationId, merged);
      },
      'message.final': (p: MessageFinalPayload) => {
        upsertStreaming(p.conversationId, { ...p.message, streaming: false });
        setPending(p.conversationId, false);
        setUnderReview(p.conversationId, false);
      },
      'message.under_review': (p: MessageUnderReviewPayload) => {
        setUnderReview(p.conversationId, true);
        setPending(p.conversationId, false);
      },
    },
  });

  const send = useCallback(
    async (body: string) => {
      const text = body.trim();
      if (!text) return;

      const clientMsg: ChatMessage = {
        id: localId('c'),
        conversationId,
        senderKind: 'client',
        body: text,
        citations: [],
        governanceStatus: 'auto_approved',
        createdAt: new Date().toISOString(),
      };
      appendMessage(conversationId, clientMsg);
      setPending(conversationId, true);
      setUnderReview(conversationId, false);

      // Live path: emit over the socket; deltas/final arrive via handlers above.
      if (realtime && connected) {
        socketSend({ type: 'chat.send', payload: { conversationId, body: text } });
        return;
      }

      // Fallback path: request/response POST (Phase 1 behavior).
      const res =
        context === 'client_page' && token
          ? await clientPageApi.sendChat(token, text, conversationId)
          : context === 'review' && sessionId
            ? await reviewChatApi.send(sessionId, text)
            : { data: null, error: 'No transport for this chat context.' };

      if (res.data) {
        const reply = res.data;
        if (reply.governanceStatus === 'pending' || reply.governanceStatus === 'blocked') {
          setUnderReview(conversationId, true);
        } else {
          appendMessage(conversationId, reply);
        }
      } else {
        setError(conversationId, res.error ?? 'The response could not be delivered right now.');
      }
      setPending(conversationId, false);
    },
    [context, conversationId, token, sessionId, realtime, connected, socketSend, appendMessage, setPending, setUnderReview, setError],
  );

  return {
    messages: thread?.messages ?? [],
    pending: thread?.pending ?? false,
    underReview: thread?.underReview ?? false,
    error: thread?.error ?? null,
    send,
  };
}
