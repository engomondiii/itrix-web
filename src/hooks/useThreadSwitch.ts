'use client';

import { useCallback } from 'react';
import { useThreadStore } from '@/store/threadStore';
import { useComposerStore } from '@/store/composerStore';
import { useContentPaneStore } from '@/store/contentPaneStore';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * SWITCHING CONVERSATIONS (Surface 1 v6.0 §3.12, R37).
 *
 * "Selecting a conversation rebinds thread context inside the mounted shell:
 *  transcript, content pane, composer label and suggested questions all follow.
 *  The shell is never unmounted."
 *
 * ── pushState HERE, replaceState ON SUBMIT — AND THAT IS DELIBERATE ──────────
 * A switch is a place the visitor navigated to, so Back should return them to the
 * conversation they came from. A submit is not: it appends to the conversation
 * they are already in, and a history entry per turn would make Back mean "undo
 * one message", which it cannot do (Architecture v2.7 §2.8). The two are
 * deliberately different, and there is a test for each.
 *
 * ── WHAT DOES *NOT* HAPPEN HERE ─────────────────────────────────────────────
 * No `advance()`, no re-qualification, no ceiling change (R36). A switch is not a
 * state change: the subject's journey state belongs to the SUBJECT, not to the
 * thread they happen to be reading. A State 10 customer opening an old thread is
 * still a State 10 customer.
 *
 * Nothing is fetched here either. The transcript hook keys off the active thread
 * and fetches what it needs; duplicating that would double every request.
 */
export interface UseThreadSwitchResult {
  /** Rebind to an existing thread. Adds a history entry. */
  switchTo: (threadId: string) => void;
}

/** The address for a thread, without navigating to it. Zone-aware: inside the
    signed-in workspace the thread's address is the portal route, so a switch
    never carries the customer out to the public surface (see setThreadUrl). */
function threadPath(threadId: string): string {
  const inWorkspace =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/workspace');
  return `${inWorkspace ? '/workspace/review' : '/review'}/${encodeURIComponent(threadId)}`;
}

export function useThreadSwitch(): UseThreadSwitchResult {
  const activeThreadId = useThreadStore((s) => s.activeThreadId);
  const setActive = useThreadStore((s) => s.setActive);
  const clearComposer = useComposerStore((s) => s.clear);
  const closePaneSheet = useContentPaneStore((s) => s.closeSheet);

  const switchTo = useCallback(
    (threadId: string) => {
      if (threadId === activeThreadId) return;

      setActive(threadId);

      /* A half-typed message belongs to the conversation it was being written in.
         Carrying it into another thread would be worse than losing it: the visitor
         would send it to the wrong place. */
      clearComposer();

      /* The pane's own state is keyed by thread, so it rebinds without being told.
         Only the mobile sheet is global, and an overlay left open over a different
         conversation is disorienting. */
      closePaneSheet();

      if (typeof window !== 'undefined') {
        const next = threadPath(threadId);
        if (window.location.pathname !== next) {
          /* pushState, so Back returns to the previous thread. */
          window.history.pushState(null, '', next);
        }
      }

      trackEvent('thread.switched', {});
    },
    [activeThreadId, setActive, clearComposer, closePaneSheet],
  );

  return { switchTo };
}
