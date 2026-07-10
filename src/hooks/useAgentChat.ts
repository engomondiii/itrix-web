'use client';

import { useCallback, useRef } from 'react';
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

/** If the socket sends nothing back this fast, we fall back to the REST POST. */
const STREAM_FIRST_TOKEN_TIMEOUT_MS = 4000;

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
 * a held reply arrives as message.under_review.
 *
 * v4.0.7 — NEVER-HANG GUARANTEE: after emitting over the socket we arm a watchdog. If no
 * token/final arrives within STREAM_FIRST_TOKEN_TIMEOUT_MS (socket dropped, server stream
 * yielded nothing, frame-shape drift, whatever), we transparently fall back to the REST
 * POST so the user always gets a reply instead of staring at "preparing a response". The
 * first streamed token cancels the watchdog and the reply streams normally.
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

  // Tracks the in-flight turn so the watchdog knows whether streaming actually started.
  const inflightRef = useRef<{ gotToken: boolean; timer: ReturnType<typeof setTimeout> | null }>({
    gotToken: false,
    timer: null,
  });

  const clearWatchdog = () => {
    if (inflightRef.current.timer) {
      clearTimeout(inflightRef.current.timer);
      inflightRef.current.timer = null;
    }
  };

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
        inflightRef.current.gotToken = true;
        clearWatchdog();
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
        inflightRef.current.gotToken = true;
        clearWatchdog();
        const cid = p.conversationId || conversationId;
        upsertStreaming(cid, normalizeMessage({ ...p.message, conversationId: cid, streaming: false }));
        setPending(cid, false);
        setUnderReview(cid, false);
      },
      'message.under_review': (p: MessageUnderReviewPayload) => {
        inflightRef.current.gotToken = true;
        clearWatchdog();
        const cid = p.conversationId || conversationId;
        setUnderReview(cid, true);
        setPending(cid, false);
      },
    },
  });

  // The REST fallback (also used directly when realtime is off / socket not open).
  const sendViaRest = useCallback(
    async (text: string) => {
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
    [context, conversationId, token, sessionId, appendMessage, setPending, setUnderReview, setError],
  );

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
      // Arm a watchdog so we never hang if the stream produces nothing.
      if (realtime && connected) {
        inflightRef.current.gotToken = false;
        clearWatchdog();
        socketSend({ type: 'chat.send', payload: { conversationId, body: text } });
        inflightRef.current.timer = setTimeout(() => {
          if (!inflightRef.current.gotToken) {
            // Streaming never started — fall back to the REST reply so the user is not stuck.
            void sendViaRest(text);
          }
        }, STREAM_FIRST_TOKEN_TIMEOUT_MS);
        return;
      }

      // Realtime off or socket not open → straight to REST.
      await sendViaRest(text);
    },
    [conversationId, realtime, connected, socketSend, appendMessage, setPending, setUnderReview, sendViaRest],
  );

  return {
    messages: thread?.messages ?? [],
    pending: thread?.pending ?? false,
    underReview: thread?.underReview ?? false,
    error: thread?.error ?? null,
    send,
  };
}
