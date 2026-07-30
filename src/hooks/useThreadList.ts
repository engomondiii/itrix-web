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
      'thread.updated': (p) => {
        if (p.thread?.id) upsert(p.thread);
      },
    },
  });

  return { threads, refresh };
}
