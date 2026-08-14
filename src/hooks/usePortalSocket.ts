'use client';

import { useCallback, useEffect, useState } from 'react';
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

interface PortalWsTicket {
  ticket: string;
  expiresIn: number;
}

/** Refresh before the 30-minute backend ticket expires, leaving a generous margin. */
const TICKET_REFRESH_MS = 25 * 60 * 1000;

/**
 * Authenticated portal socket (presence + team typing + live message stream).
 *
 * The client JWT stays in an httpOnly cookie. A WebSocket upgrade cannot be proxied
 * through the Next route handler that owns that cookie, so this hook first exchanges
 * the authenticated HTTP session for a short-lived WS-only ticket. The ticket rides in
 * Sec-WebSocket-Protocol; the long-lived client JWT never reaches browser JS.
 *
 * If ticket minting or realtime itself is unavailable, the workspace remains usable via
 * the existing HTTP/polling path.
 */
export function usePortalSocket(activeConversationId?: string | null) {
  const upsertStreaming = useChatStore((s) => s.upsertStreaming);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setUnderReview = useChatStore((s) => s.setUnderReview);
  const setPending = useChatStore((s) => s.setPending);
  const setPresentTeam = usePortalStore((s) => s.setPresentTeam);
  const [wsTicket, setWsTicket] = useState<string | null>(null);

  useEffect(() => {
    if (!siteConfig.featureFlags.realtime) {
      setWsTicket(null);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const mint = async () => {
      try {
        const res = await fetch('/api/portal/ws-ticket', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        if (!res.ok) {
          if (!cancelled) setWsTicket(null);
          return;
        }
        const data = (await res.json()) as PortalWsTicket;
        if (!cancelled) setWsTicket(typeof data.ticket === 'string' && data.ticket ? data.ticket : null);
      } catch {
        if (!cancelled) setWsTicket(null);
      }
    };

    void mint();
    timer = setInterval(() => void mint(), TICKET_REFRESH_MS);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  const streamBuffers = useCallback(() => useChatStore.getState().threads, []);

  const { status, connected, send } = useSocket({
    url: wsTicket ? wsUrls.portal() : null,
    token: wsTicket,
    enabled: siteConfig.featureFlags.realtime && Boolean(wsTicket),
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
