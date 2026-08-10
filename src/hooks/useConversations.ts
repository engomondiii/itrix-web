'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { portalApi } from '@/lib/api/portalApi';
import { useChatStore } from '@/store/chatStore';
import { usePortalStore } from '@/store/portalStore';
import type { PortalConversation, PortalThread } from '@/types/portal.types';
import type { ChatMessage } from '@/types/chat.types';

const POLL_MS = 8000;

/**
 * Portal messaging. Loads the conversation list and (optionally) an active thread,
 * and sends governed messages. Phase 2 polls the active thread; Phase 3 swaps the
 * poll for a live WebSocket subscription without changing this surface.
 */
export function useConversations(activeConversationId?: string | null) {
  const [conversations, setConversations] = useState<PortalConversation[]>([]);
  const [thread, setThread] = useState<PortalThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureThread = useChatStore((s) => s.ensureThread);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setUnderReview = useChatStore((s) => s.setUnderReview);
  const setUnread = usePortalStore((s) => s.setUnread);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadList = useCallback(async () => {
    const res = await portalApi.conversations();
    if (res.data) {
      setConversations(res.data);
      /* Keep the sidebar's Messaging badge on the same numbers this screen shows
         (unread badges, 2026-08-10). One source, so the two can never disagree. */
      setUnread(res.data.reduce((sum, c) => sum + (c.unread > 0 ? c.unread : 0), 0));
    }
    setLoading(false);
  }, [setUnread]);

  const loadThread = useCallback(
    async (id: string) => {
      const res = await portalApi.conversationMessages(id);
      if (res.data) {
        setThread(res.data);
        ensureThread(id, 'portal');
      } else if (res.error) setError(res.error);
    },
    [ensureThread],
  );

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (!activeConversationId) return;
    /* Opening a thread marks it read server-side (the messages GET calls
       mark_read), so the list is refetched right after the FIRST load — the row's
       unread pill and the sidebar badge clear as soon as the messages are on
       screen. The poll below deliberately does not re-list on every tick. */
    void loadThread(activeConversationId).then(() => loadList());
    timer.current = setInterval(() => void loadThread(activeConversationId), POLL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [activeConversationId, loadThread, loadList]);

  const send = useCallback(
    async (body: string, attachmentIds: string[] = []) => {
      const text = body.trim();
      if ((!text && attachmentIds.length === 0) || !activeConversationId) return;
      setSending(true);

      const optimistic: ChatMessage = {
        id: `local-${Date.now().toString(36)}`,
        conversationId: activeConversationId,
        senderKind: 'client',
        body: text,
        citations: [],
        governanceStatus: 'auto_approved',
        createdAt: new Date().toISOString(),
      };
      setThread((prev) => (prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev));
      appendMessage(activeConversationId, optimistic);

      const res = await portalApi.sendMessage(activeConversationId, text, attachmentIds);
      if (res.data) {
        /* The response is the client's own PERSISTED message (carrying its
           attachment chips) — not a reply. RECONCILE the optimistic entry with
           it instead of appending it as a second bubble; the team's answer
           arrives through the polling that already refreshes this thread. */
        const persisted = res.data;
        setThread((prev) =>
          prev
            ? { ...prev, messages: prev.messages.map((m) => (m.id === optimistic.id ? persisted : m)) }
            : prev,
        );
        if (persisted.governanceStatus === 'pending' || persisted.governanceStatus === 'blocked') {
          setUnderReview(activeConversationId, true);
        }
      } else {
        setError(res.error ?? 'Your message could not be delivered right now.');
      }
      setSending(false);
    },
    [activeConversationId, appendMessage, setUnderReview],
  );

  return { conversations, thread, loading, sending, error, send, reloadThread: loadThread };
}
