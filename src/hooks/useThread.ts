'use client';

import { useCallback } from 'react';
import { useThreadStore } from '@/store/threadStore';
import { useTranscriptStore } from '@/store/transcriptStore';
import { useContentPaneStore } from '@/store/contentPaneStore';
import { useScrollMemoryStore } from '@/store/scrollMemoryStore';
import { useThreadList } from '@/hooks/useThreadList';
import { useThreadSwitch } from '@/hooks/useThreadSwitch';
import { threadsApi } from '@/lib/api/threadsApi';
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
 *
 * ── v6.0 PHASE 2: TWO WAYS TO CHANGE THREAD, AND THEY ARE DIFFERENT ─────────
 *
 *   select    replaceState. Used when the URL is being CORRECTED to match a thread
 *             the visitor is already in — after a submit, or when the server issues
 *             the real id for an optimistic one.
 *   switchTo  pushState. Used when the visitor DELIBERATELY opens another
 *             conversation from the rail, so Back returns them to the one they came
 *             from (Architecture v2.7 §2.8, R37).
 *
 * Collapsing those two into one call is tempting and wrong: it would either give
 * every turn its own history entry, or make Back skip past the conversation the
 * visitor was reading.
 */
export interface UseThreadResult {
  threads: ThreadSummary[];
  activeThreadId: string | null;
  select: (threadId: string | null) => void;
  /** Deliberate switch from the rail. Adds a history entry; see the note above. */
  switchTo: (threadId: string) => void;
  startNew: () => void;
  rename: (threadId: string, title: string) => void;
  remove: (threadId: string) => void;
  refresh: () => void;
}

/**
 * Update the address bar without a route transition.
 *
 * ── ZONE-AWARE (2026-08-10) ─────────────────────────────────────────────────
 * This helper used to write the PUBLIC path unconditionally, so activating or
 * submitting inside the signed-in workspace rewrote the URL to /review/<id> —
 * and the next reconciliation (reload, Back, a router transition) landed the
 * customer on the public surface, where the conversation rail mounts beside
 * the portal they just left. That is the "second sidebar" a customer saw when
 * continuing a chat. Inside /workspace the address now stays inside
 * /workspace, where the same thread renders in the portal's own chrome.
 */
export function setThreadUrl(threadId: string | null): void {
  if (typeof window === 'undefined') return;
  const inWorkspace = window.location.pathname.startsWith('/workspace');
  const next = threadId
    ? `${inWorkspace ? '/workspace/review' : '/review'}/${encodeURIComponent(threadId)}`
    : inWorkspace
      ? '/workspace'
      : '/';
  if (window.location.pathname === next) return;
  window.history.replaceState(null, '', next);
}

export function useThread(): UseThreadResult {
  const threads = useThreadStore((s) => s.threads);
  const activeThreadId = useThreadStore((s) => s.activeThreadId);
  const setActive = useThreadStore((s) => s.setActive);
  const renameLocal = useThreadStore((s) => s.rename);
  const removeLocal = useThreadStore((s) => s.remove);
  const clearThread = useTranscriptStore((s) => s.clearThread);
  const forgetPane = useContentPaneStore((s) => s.forgetThread);
  const forgetScroll = useScrollMemoryStore((s) => s.forget);

  /* The list, and its live `thread.updated` subscription, live in useThreadList so
     the rail re-labels when the backend replaces a provisional title. */
  const { refresh } = useThreadList(activeThreadId);
  const { switchTo } = useThreadSwitch();

  const select = useCallback(
    (threadId: string | null) => {
      setActive(threadId);
      setThreadUrl(threadId);
    },
    [setActive],
  );

  const startNew = useCallback(() => {
    /* Clears the active thread and nothing else.
       It deliberately does NOT rewrite the URL. Starting a new chat has to
       return the visitor to the fresh centre, and that centre only renders
       from the `/` route segment — a replaceState leaves the /review/[threadId]
       segment rendered, which is how "New review" ended up showing a blank
       centre with no header, rails or footer.
       NewChatButton performs a real navigation instead. R21 is not in play:
       it forbids routing on SUBMIT, not on starting over. Which shell wraps
       that centre is useArrivalMode's call: front door for a first-time
       visitor, the working shell (rail + fresh composer) once conversations
       exist. */
    setActive(null);
  }, [setActive]);

  const remove = useCallback(
    (threadId: string) => {
      removeLocal(threadId);
      clearThread(threadId);
      /* Everything keyed by this thread goes with it. A deleted conversation that
         left its scroll offset and its open artifact behind would slowly accumulate
         state for threads that no longer exist — and, worse, could restore a pane
         onto an artifact from a conversation the visitor asked us to forget. */
      forgetPane(threadId);
      forgetScroll(threadId);
      if (threadId === activeThreadId) setThreadUrl(null);
      /* THE SERVER HALF OF DELETION (fix, 2026-08-10). This used to stop at the
         local removal above, so the backend still held the thread and the next
         list fetch merged it straight back into the rail — "delete" looked broken
         because it was only ever half done. The DELETE is fire-and-forget for the
         UI (the row is already gone), but a FAILURE is answered honestly: we
         refresh the list, the thread reappears, and the visitor can try again —
         never a row that silently returns hours later. */
      void threadsApi.remove(threadId).then((res) => {
        if (res.error) refresh();
      });
    },
    [removeLocal, clearThread, forgetPane, forgetScroll, activeThreadId, refresh],
  );

  return {
    threads,
    activeThreadId,
    select,
    switchTo,
    startNew,
    rename: renameLocal,
    remove,
    refresh,
  };
}
