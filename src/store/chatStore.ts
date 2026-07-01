import { create } from 'zustand';
import type { ChatMessage, ChatThreadState, ChatContext } from '@/types/chat.types';

interface ChatState {
  /** Threads keyed by conversationId. */
  threads: Record<string, ChatThreadState>;

  ensureThread: (conversationId: string, context: ChatContext) => void;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  /** Append or replace a streaming assistant message by id (Phase 3 streaming). */
  upsertStreaming: (conversationId: string, message: ChatMessage) => void;
  setPending: (conversationId: string, pending: boolean) => void;
  setUnderReview: (conversationId: string, underReview: boolean) => void;
  setError: (conversationId: string, error: string | null) => void;
  resetThread: (conversationId: string) => void;
}

function emptyThread(conversationId: string, context: ChatContext): ChatThreadState {
  return { conversationId, context, messages: [], pending: false, underReview: false, error: null };
}

export const useChatStore = create<ChatState>()((set) => ({
  threads: {},

  ensureThread: (conversationId, context) =>
    set((s) =>
      s.threads[conversationId]
        ? s
        : { threads: { ...s.threads, [conversationId]: emptyThread(conversationId, context) } },
    ),

  appendMessage: (conversationId, message) =>
    set((s) => {
      const t = s.threads[conversationId] ?? emptyThread(conversationId, 'review');
      return {
        threads: {
          ...s.threads,
          [conversationId]: { ...t, messages: [...t.messages, message], error: null },
        },
      };
    }),

  upsertStreaming: (conversationId, message) =>
    set((s) => {
      const t = s.threads[conversationId] ?? emptyThread(conversationId, 'review');
      const idx = t.messages.findIndex((m) => m.id === message.id);
      const messages =
        idx === -1 ? [...t.messages, message] : t.messages.map((m, i) => (i === idx ? message : m));
      return { threads: { ...s.threads, [conversationId]: { ...t, messages } } };
    }),

  setPending: (conversationId, pending) =>
    set((s) => {
      const t = s.threads[conversationId] ?? emptyThread(conversationId, 'review');
      return { threads: { ...s.threads, [conversationId]: { ...t, pending } } };
    }),

  setUnderReview: (conversationId, underReview) =>
    set((s) => {
      const t = s.threads[conversationId] ?? emptyThread(conversationId, 'review');
      return { threads: { ...s.threads, [conversationId]: { ...t, underReview } } };
    }),

  setError: (conversationId, error) =>
    set((s) => {
      const t = s.threads[conversationId] ?? emptyThread(conversationId, 'review');
      return { threads: { ...s.threads, [conversationId]: { ...t, error, pending: false } } };
    }),

  resetThread: (conversationId) =>
    set((s) => {
      const rest = { ...s.threads };
      delete rest[conversationId];
      return { threads: rest };
    }),
}));
