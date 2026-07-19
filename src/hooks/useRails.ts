'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { railsApi, EMPTY_RAILS, normalizeRails } from '@/lib/api/railsApi';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import type { RailsPayload } from '@/types/journey.types';
import type { RailUpdatePayload } from '@/lib/realtime/socketEvents';

const POLL_MS = 8000;

export interface UseRailsResult {
  rails: RailsPayload;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Subscribe to the AUTHORIZED rail sections for a capability token.
 *
 * Rails are content the backend authorizes (Surface 1 v4.0 §3.2). This hook is
 * the only place the frontend learns what they are, and it fails closed: any
 * error, any malformed payload, or a backend that predates the rails service all
 * resolve to an empty payload, which means neither rail mounts.
 *
 * With realtime on, `rail.update` pushes the new lists the instant the backend
 * re-authorizes them. The GET remains the initial fetch and the fallback poll.
 * Behaviour is identical either way — the flag changes latency, not semantics.
 *
 * Gated by NEXT_PUBLIC_ENABLE_RELATIONSHIP_SHELL: with the flag off this hook
 * never fetches and always returns empty rails, so the shell renders the Phase 1
 * ambient structure and every route behaves as it did before.
 */
export function useRails(token: string | null): UseRailsResult {
  const shellEnabled = siteConfig.featureFlags.relationshipShell;
  const realtime = siteConfig.featureFlags.realtime;
  const active = shellEnabled && Boolean(token);

  const [rails, setRails] = useState<RailsPayload>(EMPTY_RAILS);
  const [loading, setLoading] = useState<boolean>(active);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOnce = useCallback(async () => {
    if (!active || !token) return;
    const { data, error: err } = await railsApi.get(token);
    setRails(data ?? EMPTY_RAILS);
    setError(err);
    setLoading(false);
  }, [active, token]);

  const refresh = useCallback(() => void fetchOnce(), [fetchOnce]);

  const { status } = useSocket({
    url: active && token ? wsUrls.clientPage(token) : null,
    token,
    enabled: active && realtime,
    handlers: {
      // The backend re-authorized the rails — replace, never merge. A section the
      // backend dropped must disappear from the UI (acceptance criterion 1).
      'rail.update': (p: RailUpdatePayload) => {
        setRails(normalizeRails({ rails: p.rails }));
        setLoading(false);
        setError(null);
      },
    },
  });

  const connected = status === 'open';

  useEffect(() => {
    // When inactive we do not clear state here — the returned value is DERIVED
    // below instead. Writing state in an effect body to represent something
    // already known at render time causes a cascading re-render for no gain.
    if (!active) return;

    // An async fetch that resolves into setState is the canonical legitimate
    // effect. The lint rule cannot see that the writes happen in a promise
    // callback rather than synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchOnce();
    // Poll only while the socket is not carrying us.
    if (!realtime || !connected) {
      timer.current = setInterval(() => void fetchOnce(), POLL_MS);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [active, fetchOnce, realtime, connected]);

  // Derived, not stored: with the flag off or no token, there are no rails and
  // nothing is loading. Keeping this out of an effect means the very first
  // render is already correct.
  return active
    ? { rails, loading, error, refresh }
    : { rails: EMPTY_RAILS, loading: false, error: null, refresh };
}
