'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useJourney } from '@/hooks/useJourney';
import type { JourneyState, JourneyReveal, RevealSurface } from '@/types/journey.types';

interface JourneyContextValue {
  state: JourneyState | null;
  authorizedSurface: RevealSurface | null;
  reveals: JourneyReveal[];
  valueDelivered: boolean;
  accountInviteAvailable: boolean;
  loading: boolean;
  error: string | null;
  /** Force an immediate refetch (used after an action that may advance state). */
  refresh: () => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

/**
 * Subscribes (via useJourney) to the backend journey state for a capability token
 * and exposes it to the token-gated tree (/c/[token]). The backend owns the state;
 * this context never sets or self-reveals a surface.
 */
export function JourneyProvider({ token, children }: { token: string; children: ReactNode }) {
  const j = useJourney(token);
  return <JourneyContext.Provider value={j}>{children}</JourneyContext.Provider>;
}

export function useJourneyContext(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourneyContext must be used within a JourneyProvider');
  return ctx;
}
