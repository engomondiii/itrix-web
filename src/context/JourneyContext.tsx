'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useJourney } from '@/hooks/useJourney';
import { useRails } from '@/hooks/useRails';
import { RailsProvider } from '@/context/RailsContext';
import { journeyNumber as numberFor, stateKey as keyFor } from '@/lib/journey/journeyStates';
import type {
  JourneyState, JourneyReveal, RevealSurface, StateKey,
  IdentityState, DisclosureCeiling,
} from '@/types/journey.types';

interface JourneyContextValue {
  state: JourneyState | null;
  /** 1–10, or null for DORMANT. Components compare numbers, never enums. */
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

const JourneyContext = createContext<JourneyContextValue | null>(null);

/**
 * Subscribes to the backend journey state for a capability token and exposes it,
 * with the rails, to the token-gated tree.
 *
 * The backend owns state. This context never sets one, never self-reveals a
 * surface and never raises a ceiling — it only makes the backend's answer
 * available in a shape components can use.
 *
 * It also mounts RailsProvider, because rails and state must come from the same
 * subscription. Splitting them is how a UI ends up showing State 4's rails
 * beside State 2's centre.
 */
export function JourneyProvider({ token, children }: { token: string; children: ReactNode }) {
  const j = useJourney(token);
  const r = useRails(token);

  const value = useMemo<JourneyContextValue>(
    () => ({
      state: j.state,
      // Prefer the backend's own number; fall back to deriving it so a v3.0
      // backend that only sends a state name still drives the shell correctly.
      journeyNumber: j.journeyNumber ?? numberFor(j.state),
      stateKey: j.stateKey ?? keyFor(j.state),
      identityState: j.identityState,
      disclosureCeiling: j.disclosureCeiling,
      authorizedSurface: j.authorizedSurface,
      reveals: j.reveals,
      valueDelivered: j.valueDelivered,
      accountInviteAvailable: j.accountInviteAvailable,
      loading: j.loading,
      error: j.error,
      refresh: j.refresh,
    }),
    [j],
  );

  return (
    <JourneyContext.Provider value={value}>
      <RailsProvider rails={r.rails} loading={r.loading} error={r.error}>
        {children}
      </RailsProvider>
    </JourneyContext.Provider>
  );
}

/**
 * Outside a provider this returns a safe ARRIVED-equivalent rather than throwing.
 * The shell mounts on every public route, and most of them have no journey token
 * at all — a thrown error there would be a crash caused by the absence of a
 * relationship, which is the normal case.
 */
const FALLBACK: JourneyContextValue = {
  state: null,
  journeyNumber: null,
  stateKey: 'arrival',
  identityState: 'anonymous',
  disclosureCeiling: 'public',
  authorizedSurface: null,
  reveals: [],
  valueDelivered: false,
  accountInviteAvailable: false,
  loading: false,
  error: null,
  refresh: () => {},
};

export function useJourneyContext(): JourneyContextValue {
  return useContext(JourneyContext) ?? FALLBACK;
}
