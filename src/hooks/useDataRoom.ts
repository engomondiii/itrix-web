'use client';

import { useCallback, useEffect, useState } from 'react';
import { portalApi } from '@/lib/api/portalApi';
import type { PortalDataRoom } from '@/types/portal.types';

/** Loads documents + the NDA-gated data room (disclosure decided by the backend). */
export function useDataRoom() {
  const [data, setData] = useState<PortalDataRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await portalApi.documents();
    if (res.data) setData(res.data);
    else if (res.error) setError(res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
