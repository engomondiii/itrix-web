'use client';

import { useCallback, useEffect, useState } from 'react';
import { portalApi } from '@/lib/api/portalApi';
import { usePortalStore } from '@/store/portalStore';
import type { PortalOverview } from '@/types/portal.types';

/** Loads the workspace overview. Polls light (30s) for fresh status/unread. */
export function usePortalOverview() {
  const [data, setData] = useState<PortalOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setUnread = usePortalStore((s) => s.setUnread);

  const load = useCallback(async () => {
    const res = await portalApi.overview();
    if (res.data) {
      setData(res.data);
      setUnread(res.data.unreadMessages);
      setError(null);
    } else if (res.error) setError(res.error);
    setLoading(false);
  }, [setUnread]);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 30000);
    return () => clearInterval(t);
  }, [load]);

  return { data, loading, error, refresh: load };
}
