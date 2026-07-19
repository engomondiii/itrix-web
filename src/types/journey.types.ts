/**
 * Journey state machine — client-side mirror of the backend apps.journey model.
 *
 * The backend is the SINGLE SOURCE OF TRUTH. The frontend subscribes to state and
 * renders whatever that state authorizes. Nothing in this tree ever sets a state,
 * self-promotes a surface, or raises a disclosure ceiling.
 *
 * v4.0 — TEN NUMBERED STATES (Architecture v2.5 §11.1, Surface 1 v4.0 §4).
 */

/** The ten numbered states, plus the off-ladder DORMANT branch. */
export type JourneyState =
  | 'ARRIVED'           // 1  anonymous arrival
  | 'IN_REVIEW'         // 2  listening & clarification
  | 'DIAGNOSED'         // 3  personalized reflection
  | 'CLIENT_PAGE'       // 4  personalized pitch room
  | 'INVITED'           // 5  qualified pathway
  | 'NDA_REVIEW'        // 6  NDA & confidential review   (was CLIENT)
  | 'ASSESSMENT'        // 7  paid assessment             (was ENGAGED)
  | 'POC'               // 8  paid proof of concept       (was ENGAGED)
  | 'INTEGRATION'       // 9  integration & license-out   (was ENGAGED)
  | 'CUSTOMER_SUCCESS'  // 10 value realization           (new)
  | 'DORMANT';          //    off-ladder nurture, unnumbered

/**
 * States a v3.0 backend may still send while the Backend v5.0 migration lands.
 * `normalizeState` maps them forward so nothing downstream knows they existed.
 */
export type LegacyJourneyState = 'CLIENT' | 'ENGAGED';

/** The stable string form the backend also returns as `state_key`. */
export type StateKey =
  | 'arrival' | 'listening' | 'reflection' | 'pitch-room' | 'qualified'
  | 'nda' | 'assessment' | 'poc' | 'integration' | 'customer-success' | 'dormant';

/** Which capability-token-gated surface a state authorizes. */
export type RevealSurface =
  | 'client_page'
  | 'account_invite'
  | 'portal'
  | 'data_room'
  | 'success_overlay'   // reveal 5 — activates at the first payment (State 7+)
  | 'success_home';     // reveal 6 — State 10 becomes the default surface

/** How much the relationship knows. Distinct from the auth plane. */
export type IdentityState = 'anonymous' | 'identified' | 'authenticated_customer';

/** The disclosure ceilings (Architecture v2.5 §13.2). */
export type DisclosureCeiling =
  | 'public' | 'controlled_public' | 'nda_only' | 'customer_contract' | 'internal';

/** A single reveal pushed (realtime) or polled (fallback) from the backend. */
export interface JourneyReveal {
  surface: RevealSurface;
  capabilityToken?: string;
  state: JourneyState;
}

/**
 * The authorized rail payload. These are SECTION KEYS, not content: the backend
 * decides which sections a subject may see and the frontend renders exactly
 * those. An empty array means the rail does not mount at all.
 */
export interface RailsPayload {
  left: string[];
  right: string[];
}

/** The payload returned by GET /api/journey/[token]. */
export interface JourneyStatePayload {
  state: JourneyState;
  /** 1–10, or null for DORMANT. Denormalised so the UI never imports the enum. */
  journeyNumber?: number | null;
  stateKey?: StateKey;
  identityState?: IdentityState;
  disclosureCeiling?: DisclosureCeiling;
  authorizedSurface: RevealSurface | null;
  reveals: JourneyReveal[];
  valueDelivered: boolean;
  accountInviteAvailable: boolean;
  /** Authorized rail sections. Absent on a v3.0 backend → both rails stay empty. */
  rails?: RailsPayload;
}
