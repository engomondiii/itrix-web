'use client';

import { useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { clientPageApi, reviewChatApi } from '@/lib/api/clientPageApi';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import type { ChatContext, ChatMessage, Citation } from '@/types/chat.types';
import type { MessageDeltaPayload, MessageFinalPayload, MessageUnderReviewPayload } from '@/lib/realtime/socketEvents';

function localId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Guarantee a fully-formed ChatMessage — never let `citations` be undefined. */
function normalizeMessage(m: Partial<ChatMessage> & { id: string; conversationId: string }): ChatMessage {
  const citations: Citation[] = Array.isArray(m.citations) ? m.citations : [];
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderKind: m.senderKind ?? 'agent',
    agentKey: m.agentKey ?? null,
    body: m.body ?? '',
    citations,
    governanceStatus: m.governanceStatus ?? 'auto_approved',
    streaming: m.streaming ?? false,
    createdAt: m.createdAt ?? new Date().toISOString(),
  };
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
 * Realtime ON: the agent reply streams over the socket (message.delta → message.final);
 * a held reply arrives as message.under_review. Realtime OFF (or socket not open): the
 * Phase 1 request/response POST is used — identical surface, same "under review" state.
 *
 * v4.0.3: every message that enters the store is passed through ``normalizeMessage`` so a
 * missing ``citations`` (from any transport) can never crash ``ChatThread``.
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
        const cid = p.conversationId || conversationId;
        const existing = useChatStore
          .getState()
          .threads[cid]?.messages.find((m) => m.id === p.messageId);
        const merged = normalizeMessage(
          existing
            ? { ...existing, body: existing.body + p.delta, streaming: true }
            : {
                id: p.messageId,
                conversationId: cid,
                senderKind: p.senderKind ?? 'agent',
                agentKey: p.agentKey ?? 'concierge',
                body: p.delta,
                streaming: true,
              },
        );
        upsertStreaming(cid, merged);
        setPending(cid, true);
      },
      'message.final': (p: MessageFinalPayload) => {
        const cid = p.conversationId || conversationId;
        upsertStreaming(cid, normalizeMessage({ ...p.message, conversationId: cid, streaming: false }));
        setPending(cid, false);
        setUnderReview(cid, false);
      },
      'message.under_review': (p: MessageUnderReviewPayload) => {
        const cid = p.conversationId || conversationId;
        setUnderReview(cid, true);
        setPending(cid, false);
      },
    },
  });

  const send = useCallback(
    async (body: string) => {
      const text = body.trim();
      if (!text) return;

      const clientMsg = normalizeMessage({
        id: localId('c'),
        conversationId,
        senderKind: 'client',
        body: text,
      });
      appendMessage(conversationId, clientMsg);
      setPending(conversationId, true);
      setUnderReview(conversationId, false);

      // Live path: emit over the socket; deltas/final arrive via handlers above.
      if (realtime && connected) {
        socketSend({ type: 'chat.send', payload: { conversationId, body: text } });
        return;
      }

      // Fallback path: request/response POST.
      const res =
        context === 'client_page' && token
          ? await clientPageApi.sendChat(token, text, conversationId)
          : context === 'review' && sessionId
            ? await reviewChatApi.send(sessionId, text)
            : { data: null, error: 'No transport for this chat context.' };

      if (res.data) {
        if (res.data.underReview || !res.data.message) {
          setUnderReview(conversationId, true);
        } else {
          appendMessage(conversationId, normalizeMessage({ ...res.data.message, conversationId }));
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
