'use client';

import type { ReactNode } from 'react';
import { useJourneyContext } from '@/context/JourneyContext';
import type { RevealSurface } from '@/types/journey.types';

/**
 * Renders its children ONLY when the current journey state authorizes the given
 * surface. The backend decides authorization; this component never self-promotes a
 * hidden surface — it reflects what the journey (via JourneyContext) permits.
 *
 * Phase 3: JourneyContext is now fed by live journey.reveal pushes (useJourney's WS
 * subscription), so this gate flips the instant a reveal fires — no reload, no poll
 * lag. The GET poll remains a fallback, so the gate still works with realtime off.
 */
export function RevealGate({
  surface,
  children,
  fallback = null,
}: {
  surface: RevealSurface;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { authorizedSurface, reveals, accountInviteAvailable } = useJourneyContext();

  const authorized =
    authorizedSurface === surface ||
    reveals.some((r) => r.surface === surface) ||
    (surface === 'account_invite' && accountInviteAvailable);

  return <>{authorized ? children : fallback}</>;
}
