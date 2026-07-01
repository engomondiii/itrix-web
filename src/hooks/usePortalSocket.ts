'use client';

import { useCallback } from 'react';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { useChatStore } from '@/store/chatStore';
import { usePortalStore } from '@/store/portalStore';
import { siteConfig } from '@/config/site.config';
import type { ChatMessage } from '@/types/chat.types';
import type {
  MessageDeltaPayload,
  MessageFinalPayload,
  MessageUnderReviewPayload,
  PresenceUpdatePayload,
  TeamTypingPayload,
} from '@/lib/realtime/socketEvents';

/**
 * Authenticated portal socket (presence + team typing + live message stream).
 *
 * The portal page has already authenticated via the httpOnly client-JWT cookie, so
 * the WS upgrade is authorized server-side (no in-band token). Streams agent/team
 * message deltas into the chat store, flips the under-review state, and keeps
 * presence in the portal store. When realtime is off, this is inert and the portal
 * keeps polling (useConversations) unchanged.
 */
export function usePortalSocket(activeConversationId?: string | null) {
  const upsertStreaming = useChatStore((s) => s.upsertStreaming);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setUnderReview = useChatStore((s) => s.setUnderReview);
  const setPending = useChatStore((s) => s.setPending);
  const setPresentTeam = usePortalStore((s) => s.setPresentTeam);

  const streamBuffers = useCallback(() => useChatStore.getState().threads, []);

  const { status, connected, send } = useSocket({
    url: wsUrls.portal(),
    enabled: siteConfig.featureFlags.realtime,
    handlers: {
      'message.delta': (p: MessageDeltaPayload) => {
        const threads = streamBuffers();
        const existing = threads[p.conversationId]?.messages.find((m) => m.id === p.messageId);
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
        setPending(p.conversationId, true);
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
      'presence.update': (p: PresenceUpdatePayload) => {
        if (!activeConversationId || p.conversationId === activeConversationId) {
          setPresentTeam(p.present);
        }
      },
      'team.typing': (_p: TeamTypingPayload) => {
        /* reserved for a future typing indicator; presence bar covers the common case */
      },
    },
  });

  const sendTyping = useCallback(
    (conversationId: string, typing: boolean) => {
      if (connected) send({ type: 'chat.typing', payload: { conversationId, typing } });
    },
    [connected, send],
  );

  // Ensure appendMessage stays referenced for consumers that want direct sends.
  void appendMessage;

  return { status, connected, sendTyping, send };
}
