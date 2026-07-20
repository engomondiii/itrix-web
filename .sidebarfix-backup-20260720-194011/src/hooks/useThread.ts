'use client';

import { useCallback, useEffect } from 'react';
import { threadsApi } from '@/lib/api/threadsApi';
import { useThreadStore } from '@/store/threadStore';
import { useTranscriptStore } from '@/store/transcriptStore';
import type { ThreadSummary } from '@/types/thread.types';

/**
 * The conversation list and the active thread.
 *
 * The backend owns threads. This hook keeps the local mirror in step and gives
 * the sidebar something to render when the backend has not answered yet.
 *
 * `select` is NOT a navigation. It sets the active thread and updates the URL
 * with history.replaceState so the conversation is addressable and refresh-safe
 * — the transcript node is never unmounted (R21, Surface 1 v5.0 §2.3).
 */
export interface UseThreadResult {
  threads: ThreadSummary[];
  activeThreadId: string | null;
  select: (threadId: string | null) => void;
  startNew: () => void;
  rename: (threadId: string, title: string) => void;
  remove: (threadId: string) => void;
  refresh: () => void;
}

/** Update the address bar without a route transition. */
export function setThreadUrl(threadId: string | null): void {
  if (typeof window === 'undefined') return;
  const next = threadId ? `/review/${encodeURIComponent(threadId)}` : '/';
  if (window.location.pathname === next) return;
  window.history.replaceState(null, '', next);
}

export function useThread(): UseThreadResult {
  const threads = useThreadStore((s) => s.threads);
  const activeThreadId = useThreadStore((s) => s.activeThreadId);
  const setActive = useThreadStore((s) => s.setActive);
  const mergeFromServer = useThreadStore((s) => s.mergeFromServer);
  const renameLocal = useThreadStore((s) => s.rename);
  const removeLocal = useThreadStore((s) => s.remove);
  const clearThread = useTranscriptStore((s) => s.clearThread);

  const refresh = useCallback(() => {
    void (async () => {
      const { data } = await threadsApi.list();
      /* Only replace the local list when the backend actually answered. A failed
         fetch must not wipe a visitor's conversation list. */
      if (data) mergeFromServer(data);
    })();
  }, [mergeFromServer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const select = useCallback(
    (threadId: string | null) => {
      setActive(threadId);
      setThreadUrl(threadId);
    },
    [setActive],
  );

  const startNew = useCallback(() => {
    /* A new review is the empty state, not a new page: the same shell stays
       mounted and the composer returns to the centre. */
    setActive(null);
    setThreadUrl(null);
  }, [setActive]);

  const remove = useCallback(
    (threadId: string) => {
      removeLocal(threadId);
      clearThread(threadId);
      if (threadId === activeThreadId) setThreadUrl(null);
    },
    [removeLocal, clearThread, activeThreadId],
  );

  return {
    threads,
    activeThreadId,
    select,
    startNew,
    rename: renameLocal,
    remove,
    refresh,
  };
}
