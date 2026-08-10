'use client';

import { useCallback, useEffect } from 'react';
import { portalApi } from '@/lib/api/portalApi';
import { usePortalStore } from '@/store/portalStore';

const POLL_MS = 30000;

/**
 * Keeps the sidebar's unread-message count alive (2026-08-10).
 *
 * The count in `usePortalStore` had exactly one writer — `usePortalOverview` —
 * and NOTHING mounted that hook, so the Messaging badge could never appear no
 * matter how many messages were waiting. This hook is the missing mount point:
 * it sums the per-conversation unread counts from the conversation list (the
 * same numbers the Messaging screen shows, so the two can never disagree) and
 * polls lightly. Mounted by PortalSidebar, which is present on every workspace
 * screen. Django authorizes the list on every call; a failed fetch keeps the
 * last known count rather than flashing the badge away on a network blip.
 */
export function usePortalUnread() {
  const setUnread = usePortalStore((s) => s.setUnread);

  const load = useCallback(async () => {
    const res = await portalApi.conversations();
    if (res.data) {
      setUnread(res.data.reduce((sum, c) => sum + (c.unread > 0 ? c.unread : 0), 0));
    }
  }, [setUnread]);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(t);
  }, [load]);
}
