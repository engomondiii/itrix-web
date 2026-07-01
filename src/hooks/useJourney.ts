'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { journeyApi } from '@/lib/api/journeyApi';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import type { JourneyState, JourneyReveal, RevealSurface } from '@/types/journey.types';
import type { JourneyRevealPayload } from '@/lib/realtime/socketEvents';

const POLL_MS = 5000;

interface UseJourneyResult {
  state: JourneyState | null;
  authorizedSurface: RevealSurface | null;
  reveals: JourneyReveal[];
  valueDelivered: boolean;
  accountInviteAvailable: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Subscribe to journey state for a capability token.
 *
 * Phase 3: when realtime is ON, a WebSocket subscription (journey.reveal) pushes
 * state the instant the backend authorizes a surface — no reload, no poll lag. The
 * GET remains as (a) the initial fetch and (b) a fallback poll while the socket is
 * connecting or when realtime is OFF. The public shape is identical across phases.
 */
export function useJourney(token: string | null): UseJourneyResult {
  const [state, setState] = useState<JourneyState | null>(null);
  const [authorizedSurface, setAuthorizedSurface] = useState<RevealSurface | null>(null);
  const [reveals, setReveals] = useState<JourneyReveal[]>([]);
  const [valueDelivered, setValueDelivered] = useState(false);
  const [accountInviteAvailable, setAccountInviteAvailable] = useState(false);
  const [loading, setLoading] = useState<boolean>(Boolean(token));
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const realtime = siteConfig.featureFlags.realtime;

  const fetchOnce = useCallback(async () => {
    if (!token) return;
    const { data, error: err } = await journeyApi.getState(token);
    if (data) {
      setState(data.state);
      setAuthorizedSurface(data.authorizedSurface);
      setReveals(data.reveals ?? []);
      setValueDelivered(Boolean(data.valueDelivered));
      setAccountInviteAvailable(Boolean(data.accountInviteAvailable));
      setError(null);
    } else if (err) {
      setError(err);
    }
    setLoading(false);
  }, [token]);

  const refresh = useCallback(() => {
    void fetchOnce();
  }, [fetchOnce]);

  // Live journey.reveal pushes (Phase 3). Merges into the same state the GET fills.
  const { connected } = useSocket({
    url: token ? wsUrls.clientPage(token) : null,
    token,
    enabled: realtime && Boolean(token),
    handlers: {
      'journey.reveal': (p: JourneyRevealPayload) => {
        setState(p.state);
        setAuthorizedSurface(p.authorizedSurface);
        setReveals((prev) => {
          const exists = prev.some((r) => r.surface === p.reveal.surface);
          return exists ? prev : [...prev, p.reveal];
        });
        setValueDelivered(Boolean(p.valueDelivered));
        setAccountInviteAvailable(Boolean(p.accountInviteAvailable));
        setLoading(false);
        setError(null);
      },
    },
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void fetchOnce(); // always do the initial GET

    // Poll only while the socket isn't carrying us (realtime off, or not yet open).
    const shouldPoll = !realtime || !connected;
    if (shouldPoll) {
      timer.current = setInterval(() => void fetchOnce(), POLL_MS);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [token, fetchOnce, realtime, connected]);

  return { state, authorizedSurface, reveals, valueDelivered, accountInviteAvailable, loading, error, refresh };
}
