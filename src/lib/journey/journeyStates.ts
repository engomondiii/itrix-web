import type {
  JourneyState, RevealSurface, StateKey,
} from '@/types/journey.types';

/**
 * The ten-state journey vocabulary (Surface 1 v4.0 §4, Architecture v2.5 §11.1).
 *
 * The backend owns STATE; this module owns only the client-side VOCABULARY —
 * ordering, numbering, normalisation and the predicates components need.
 * Nothing here decides what a visitor may see.
 */

/** Ordered lifecycle, 1–10. DORMANT is off-ladder and not on it. */
export const JOURNEY_ORDER: JourneyState[] = [
  'ARRIVED', 'IN_REVIEW', 'DIAGNOSED', 'CLIENT_PAGE', 'INVITED',
  'NDA_REVIEW', 'ASSESSMENT', 'POC', 'INTEGRATION', 'CUSTOMER_SUCCESS',
];

export const JOURNEY_NUMBER: Record<JourneyState, number | null> = {
  ARRIVED: 1, IN_REVIEW: 2, DIAGNOSED: 3, CLIENT_PAGE: 4, INVITED: 5,
  NDA_REVIEW: 6, ASSESSMENT: 7, POC: 8, INTEGRATION: 9, CUSTOMER_SUCCESS: 10,
  DORMANT: null,
};

export const STATE_KEY: Record<JourneyState, StateKey> = {
  ARRIVED: 'arrival', IN_REVIEW: 'listening', DIAGNOSED: 'reflection',
  CLIENT_PAGE: 'pitch-room', INVITED: 'qualified', NDA_REVIEW: 'nda',
  ASSESSMENT: 'assessment', POC: 'poc', INTEGRATION: 'integration',
  CUSTOMER_SUCCESS: 'customer-success', DORMANT: 'dormant',
};

/** The surface each state authorizes on Surface 1 (null = public/static only). */
export const STATE_SURFACE: Record<JourneyState, RevealSurface | null> = {
  ARRIVED: null,
  IN_REVIEW: null,
  DIAGNOSED: 'client_page',
  CLIENT_PAGE: 'client_page',
  INVITED: 'account_invite',
  NDA_REVIEW: 'portal',
  ASSESSMENT: 'data_room',
  POC: 'data_room',
  INTEGRATION: 'data_room',
  CUSTOMER_SUCCESS: 'success_home',
  DORMANT: null,
};

/** v3.0 wire values → their v4.0 equivalents (Backend v5.0 keeps these one release). */
const LEGACY: Record<string, JourneyState> = {
  CLIENT: 'NDA_REVIEW',
  ENGAGED: 'ASSESSMENT',
};

/**
 * Accept any state the backend sends — current, legacy or unknown — and return
 * something safe.
 *
 * An UNKNOWN state resolves to ARRIVED, the most restrictive state there is.
 * That is deliberate. If the two vocabularies ever drift, the failure mode must
 * be "the visitor sees less than they were entitled to", never "the visitor sees
 * something they were not".
 */
export function normalizeState(raw: string | null | undefined): JourneyState {
  if (!raw) return 'ARRIVED';
  if (Object.prototype.hasOwnProperty.call(JOURNEY_NUMBER, raw)) return raw as JourneyState;
  if (Object.prototype.hasOwnProperty.call(LEGACY, raw)) return LEGACY[raw];
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[journey] Unknown state "${raw}" — falling back to ARRIVED (most restrictive).`);
  }
  return 'ARRIVED';
}

export function stateIndex(state: JourneyState): number {
  return JOURNEY_ORDER.indexOf(state);
}

/** The 1–10 number, or null for DORMANT / unknown. */
export function journeyNumber(state: JourneyState | null | undefined): number | null {
  if (!state) return null;
  return JOURNEY_NUMBER[state] ?? null;
}

export function stateKey(state: JourneyState | null | undefined): StateKey {
  if (!state) return 'arrival';
  return STATE_KEY[state] ?? 'arrival';
}

/** True if `state` has reached at least `target` on the main path. */
export function hasReached(state: JourneyState, target: JourneyState): boolean {
  const a = stateIndex(state);
  const b = stateIndex(target);
  if (a === -1 || b === -1) return false; // DORMANT reaches nothing
  return a >= b;
}

export function canViewClientPage(state: JourneyState): boolean {
  return hasReached(state, 'DIAGNOSED');
}

export function canCreateAccount(state: JourneyState): boolean {
  return hasReached(state, 'INVITED');
}

/** A workspace state (7–10): rails become full workspace navigation. */
export function isWorkspaceState(state: JourneyState | null | undefined): boolean {
  const n = journeyNumber(state);
  return n !== null && n >= 7;
}

/**
 * The customer-success overlay activates at the FIRST PAYMENT (State 7), not at
 * license-out (Architecture v2.5 §7.1, §11.4). A paid Assessment customer must
 * already see named owners, support access and success goals.
 */
export function isSuccessOverlayActive(state: JourneyState | null | undefined): boolean {
  return isWorkspaceState(state);
}

/** State 10 proper — the customer-success home is the default surface. */
export function isCustomerSuccessState(state: JourneyState | null | undefined): boolean {
  return state === 'CUSTOMER_SUCCESS';
}

/** States 2–3: the review conversation lives in the centre. */
export function isReviewState(state: JourneyState | null | undefined): boolean {
  const n = journeyNumber(state);
  return n === 2 || n === 3;
}
