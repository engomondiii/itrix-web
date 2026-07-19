'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiResult } from '@/lib/api/journeyApi';

export interface PortalResource<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * The shared read pattern for every portal resource.
 *
 * Nine Phase 3 hooks fetch a client-JWT-gated payload, expose loading and error,
 * and offer a refresh. Writing that effect nine times is nine chances to get the
 * cleanup or the enabled-guard subtly different, so it lives here once.
 *
 * `enabled` is how a hook stays inert behind a feature flag: when false it never
 * fetches and reports nothing loading, so a disabled zone costs no requests.
 *
 * `key` is how a caller re-fetches on a changing input. It is a string rather
 * than a dependency array because a fresh array literal on every render would
 * re-run the effect forever — the caller states WHAT changed, and the fetcher
 * itself is held in a ref so an inline closure never restarts the request.
 */
export function usePortalResource<T>(
  fetcher: () => Promise<ApiResult<T>>,
  { enabled = true, key = '' }: { enabled?: boolean; key?: string } = {},
): PortalResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  // The ref is written in an effect, never during render: mutating a ref while
  // rendering is the pattern that breaks under concurrent rendering, because a
  // render that React discards would still have changed it.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const load = useCallback(async () => {
    const res = await fetcherRef.current();
    setData(res.data);
    setError(res.error);
    setLoading(false);
  }, []);

  const refresh = useCallback(() => void load(), [load]);

  useEffect(() => {
    if (!enabled) return;
    // An async fetch resolving into setState is the canonical legitimate effect;
    // the writes happen in a promise callback, not synchronously in the body.
    void load();
  }, [enabled, key, load]);

  return enabled
    ? { data, loading, error, refresh }
    : { data: null, loading: false, error: null, refresh };
}
