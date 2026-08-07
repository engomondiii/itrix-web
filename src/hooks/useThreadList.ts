'use client';

import { useCallback, useEffect } from 'react';
import { threadsApi } from '@/lib/api/threadsApi';
import { useThreadStore } from '@/store/threadStore';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import type { ThreadSummary } from '@/types/thread.types';

/**
 * The conversation list, kept live.
 *
 * ── WHAT THIS ADDS OVER useThread ───────────────────────────────────────────
 * `useThread` owns the list AND the active thread AND the mutations. This hook is
 * the read side, with one addition: it subscribes to `thread.updated`, so a thread
 * renamed by the backend — most often when the generated title replaces the
 * visitor's provisional one — re-orders and re-labels in the rail without a poll.
 *
 * A FAILED FETCH NEVER WIPES THE LIST. `mergeFromServer` is only called when the
 * backend actually answered; a network blip must not make a visitor's conversations
 * appear to have been deleted.
 *
 * The list is metadata only — id, title, timestamps. Never transcript text
 * (Surface 1 v6.0 §7.5).
 */
export interface UseThreadListResult {
  threads: ThreadSummary[];
  refresh: () => void;
}

export function useThreadList(activeThreadId: string | null): UseThreadListResult {
  const threads = useThreadStore((s) => s.threads);
  const mergeFromServer = useThreadStore((s) => s.mergeFromServer);
  const upsert = useThreadStore((s) => s.upsert);

  const refresh = useCallback(() => {
    void (async () => {
      const { data } = await threadsApi.list();
      if (data) mergeFromServer(data);
    })();
  }, [mergeFromServer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useSocket({
    url: activeThreadId ? wsUrls.review(activeThreadId) : null,
    enabled: siteConfig.featureFlags.realtime && Boolean(activeThreadId),
    handlers: {
      /*
       * The backend sends this FLAT — {threadId, title, state, claimed} — so the
       * old `p.thread?.id` read never matched and every frame was discarded. That
       * is what left a new conversation showing a bare "4m ago" in the rail: the
       * generated title arrived on the socket and was dropped.
       *
       * Merged into the EXISTING row rather than replacing it: the frame carries no
       * timestamps, so upserting it whole would blank `lastActivityAt` and throw the
       * rail's ordering out.
       */
      'thread.updated': (p) => {
        if (p.thread?.id) {
          upsert(p.thread);
          return;
        }
        const id = p.threadId;
        if (!id) return;

        const known = useThreadStore.getState().threads.find((t) => t.id === id);
        const now = new Date().toISOString();
        upsert({
          ...(known ?? { id, createdAt: now, lastActivityAt: now }),
          id,
          /* An empty title must not erase a title we already show. */
          title: p.title || known?.title || '',
          lastActivityAt: known?.lastActivityAt ?? now,
        });
      },
    },
  });

  return { threads, refresh };
}
