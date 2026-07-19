'use client';

import type { ReactNode } from 'react';
import { useJourneyContext } from '@/context/JourneyContext';
import { isSuccessOverlayActive, isCustomerSuccessState } from '@/lib/journey/journeyStates';
import type { RevealSurface } from '@/types/journey.types';

/**
 * Renders its children ONLY when the current journey state authorizes the given
 * surface.
 *
 * The backend decides authorization. This component never self-promotes a hidden
 * surface — it reflects what the journey permits and nothing more. A visitor
 * cannot open a gate by editing a URL or crafting a prompt, because nothing here
 * derives entitlement from anything they control.
 *
 * PHASE 2 recognises the two new reveals (Architecture v2.5 §11.5):
 *
 *   5 success_overlay — fires at the FIRST PAYMENT (State 7+), not at
 *     license-out. A paid Assessment customer already gets named owners, support
 *     access and success goals; making them wait for a signed licence would be
 *     the customer-first principle inverted.
 *   6 success_home — the customer-success home becomes their default surface
 *     once a contract is executed (State 10).
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
  const { authorizedSurface, reveals, accountInviteAvailable, state } = useJourneyContext();

  const explicitly =
    authorizedSurface === surface || reveals.some((r) => r.surface === surface);

  const authorized =
    explicitly ||
    (surface === 'account_invite' && accountInviteAvailable) ||
    // The overlay is a STATE fact, not a one-off event: a customer who reloads
    // after their first payment must still see it without waiting for a push.
    (surface === 'success_overlay' && isSuccessOverlayActive(state)) ||
    (surface === 'success_home' && isCustomerSuccessState(state));

  return <>{authorized ? children : fallback}</>;
}
