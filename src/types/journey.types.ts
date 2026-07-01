/**
 * Journey state machine — client-side mirror of the backend apps.journey model.
 * The backend is the single source of truth; the frontend only subscribes to
 * state and renders whatever the current state authorizes (see useJourney).
 */

/** The eight journey states (mirrors backend JourneyState). */
export type JourneyState =
  | 'ARRIVED'
  | 'IN_REVIEW'
  | 'DIAGNOSED'
  | 'CLIENT_PAGE'
  | 'INVITED'
  | 'CLIENT'
  | 'ENGAGED'
  | 'DORMANT';

/** Which capability-token-gated surface a state authorizes. */
export type RevealSurface = 'client_page' | 'account_invite' | 'portal' | 'data_room';

/** A single reveal pushed (Phase 3) or polled (Phase 1) from the backend. */
export interface JourneyReveal {
  surface: RevealSurface;
  /** Capability token bound to this reveal, when the backend mints one. */
  capabilityToken?: string;
  /** The state at which the reveal fired. */
  state: JourneyState;
}

/** The payload returned by GET /api/journey/[token]. */
export interface JourneyStatePayload {
  state: JourneyState;
  /** The single surface the subject is authorized to see right now. */
  authorizedSurface: RevealSurface | null;
  /** Reveal(s) currently active for the subject. */
  reveals: JourneyReveal[];
  /** True once at least one value artifact has been delivered (value-first gate). */
  valueDelivered: boolean;
  /** True when the account-creation reveal is unlocked (INVITED). */
  accountInviteAvailable: boolean;
}
