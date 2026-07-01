'use client';

import { useCallback, useEffect, useState } from 'react';
import { portalApi } from '@/lib/api/portalApi';
import type { PortalEvaluation } from '@/types/portal.types';

/** Loads evaluation tracking (requested → scoping → in progress → report ready). */
export function useEvalTracking() {
  const [data, setData] = useState<PortalEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await portalApi.evaluation();
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
