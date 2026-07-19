'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { journeyApi } from '@/lib/api/journeyApi';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import { normalizeState, journeyNumber as numberFor, stateKey as keyFor } from '@/lib/journey/journeyStates';
import type {
  JourneyState, JourneyReveal, RevealSurface, StateKey,
  IdentityState, DisclosureCeiling,
} from '@/types/journey.types';
import type { JourneyRevealPayload } from '@/lib/realtime/socketEvents';

const POLL_MS = 5000;

interface UseJourneyResult {
  state: JourneyState | null;
  journeyNumber: number | null;
  stateKey: StateKey;
  identityState: IdentityState;
  disclosureCeiling: DisclosureCeiling;
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
 * v4.0 adds journey_number, state_key, identity_state and disclosure_ceiling to
 * the subscription, and handles `rail.update` alongside `journey.reveal`.
 *
 * Two things this hook will not do, both deliberate:
 *
 *   · It never DERIVES authorization. `authorizedSurface`, `valueDelivered` and
 *     `accountInviteAvailable` come from the backend verbatim. A visitor cannot
 *     reach a surface by manipulating a URL or a prompt, because nothing here
 *     computes entitlement from anything the visitor controls.
 *
 *   · It never trusts an unknown state. `normalizeState` maps legacy values
 *     forward and resolves anything unrecognised to ARRIVED — the most
 *     restrictive state. Vocabulary drift costs a visitor access they had;
 *     it never grants access they did not.
 *
 * With realtime on, pushes update state the instant the backend authorizes it.
 * The GET remains the initial fetch and the fallback poll; behaviour is
 * identical either way.
 */
export function useJourney(token: string | null): UseJourneyResult {
  const [state, setState] = useState<JourneyState | null>(null);
  const [journeyNumber, setJourneyNumber] = useState<number | null>(null);
  const [stateKey, setStateKey] = useState<StateKey>('arrival');
  const [identityState, setIdentityState] = useState<IdentityState>('anonymous');
  const [disclosureCeiling, setDisclosureCeiling] = useState<DisclosureCeiling>('public');
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
      const normalized = normalizeState(data.state);
      setState(normalized);
      setJourneyNumber(data.journeyNumber ?? numberFor(normalized));
      setStateKey(data.stateKey ?? keyFor(normalized));
      setIdentityState(data.identityState ?? 'anonymous');
      setDisclosureCeiling(data.disclosureCeiling ?? 'public');
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

  const refresh = useCallback(() => void fetchOnce(), [fetchOnce]);

  const { status } = useSocket({
    url: token ? wsUrls.clientPage(token) : null,
    token,
    enabled: realtime && Boolean(token),
    handlers: {
      'journey.reveal': (p: JourneyRevealPayload) => {
        const normalized = normalizeState(p.state);
        setState(normalized);
        setJourneyNumber(p.journeyNumber ?? numberFor(normalized));
        setStateKey(p.stateKey ?? keyFor(normalized));
        if (p.identityState) setIdentityState(p.identityState);
        if (p.disclosureCeiling) setDisclosureCeiling(p.disclosureCeiling);
        setAuthorizedSurface(p.authorizedSurface);
        setReveals((prev) =>
          prev.some((r) => r.surface === p.reveal.surface) ? prev : [...prev, p.reveal],
        );
        setValueDelivered(Boolean(p.valueDelivered));
        setAccountInviteAvailable(Boolean(p.accountInviteAvailable));
        setLoading(false);
        setError(null);
      },
      // A rails re-authorization can accompany a state change. useRails owns the
      // rail lists themselves; here we only keep the number in step so the shell
      // never renders State 4 rails beside a State 2 centre.
      'rail.update': (p) => {
        if (p.journeyNumber !== undefined && p.journeyNumber !== null) {
          setJourneyNumber(p.journeyNumber);
        } else if (p.journeyState) {
          setJourneyNumber(numberFor(normalizeState(p.journeyState)));
        }
      },
    },
  });

  const connected = status === 'open';

  useEffect(() => {
    // No token means no subscription. The result is DERIVED below rather than
    // written here — representing something already known at render time as
    // effect state just causes a cascading render.
    if (!token) return;

    // An async fetch that resolves into setState is the canonical legitimate
    // effect. The lint rule cannot see that the writes happen in a promise
    // callback rather than synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchOnce();
    if (!realtime || !connected) {
      timer.current = setInterval(() => void fetchOnce(), POLL_MS);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [token, fetchOnce, realtime, connected]);

  return {
    state, journeyNumber, stateKey, identityState, disclosureCeiling,
    authorizedSurface, reveals, valueDelivered, accountInviteAvailable,
    // Derived: with no token there is nothing to load and nothing to report.
    loading: token ? loading : false,
    error: token ? error : null,
    refresh,
  };
}
