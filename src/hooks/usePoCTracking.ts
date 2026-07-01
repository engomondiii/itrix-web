'use client';

import { useCallback, useEffect, useState } from 'react';
import { portalApi } from '@/lib/api/portalApi';
import type { PortalPoC } from '@/types/portal.types';

/** Loads PoC milestone tracking (planning → setup → execution → review → decision). */
export function usePoCTracking() {
  const [data, setData] = useState<PortalPoC | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await portalApi.poc();
    if (res.data) setData(res.data);
    else if (res.error) setError(res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 60000);
    return () => clearInterval(t);
  }, [load]);

  return { data, loading, error, refresh: load };
}
