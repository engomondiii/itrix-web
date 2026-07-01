'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { portalApi } from '@/lib/api/portalApi';
import { useChatStore } from '@/store/chatStore';
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
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadList = useCallback(async () => {
    const res = await portalApi.conversations();
    if (res.data) setConversations(res.data);
    setLoading(false);
  }, []);

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
    void loadThread(activeConversationId);
    timer.current = setInterval(() => void loadThread(activeConversationId), POLL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [activeConversationId, loadThread]);

  const send = useCallback(
    async (body: string) => {
      const text = body.trim();
      if (!text || !activeConversationId) return;
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

      const res = await portalApi.sendMessage(activeConversationId, text);
      if (res.data) {
        if (res.data.governanceStatus === 'pending' || res.data.governanceStatus === 'blocked') {
          setUnderReview(activeConversationId, true);
        } else {
          setThread((prev) => (prev ? { ...prev, messages: [...prev.messages, res.data as ChatMessage] } : prev));
          appendMessage(activeConversationId, res.data);
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
