import type { JourneyState, RevealSurface } from '@/types/journey.types';

/** Ordered lifecycle (excluding the terminal DORMANT branch). */
export const JOURNEY_ORDER: JourneyState[] = [
  'ARRIVED',
  'IN_REVIEW',
  'DIAGNOSED',
  'CLIENT_PAGE',
  'INVITED',
  'CLIENT',
  'ENGAGED',
];

/** The surface each state authorizes on Surface 1 (null = public/static only). */
export const STATE_SURFACE: Record<JourneyState, RevealSurface | null> = {
  ARRIVED: null,
  IN_REVIEW: null,
  DIAGNOSED: 'client_page',
  CLIENT_PAGE: 'client_page',
  INVITED: 'account_invite',
  CLIENT: 'portal',
  ENGAGED: 'data_room',
  DORMANT: null,
};

export function stateIndex(state: JourneyState): number {
  const i = JOURNEY_ORDER.indexOf(state);
  return i === -1 ? -1 : i;
}

/** True if `state` has reached at least `target` on the main path. */
export function hasReached(state: JourneyState, target: JourneyState): boolean {
  return stateIndex(state) >= stateIndex(target);
}

/** Whether the customized client page is viewable in this state. */
export function canViewClientPage(state: JourneyState): boolean {
  return hasReached(state, 'DIAGNOSED') && state !== 'DORMANT';
}

/** Whether the hidden account-creation reveal is unlocked in this state. */
export function canCreateAccount(state: JourneyState): boolean {
  return hasReached(state, 'INVITED') && state !== 'DORMANT';
}
