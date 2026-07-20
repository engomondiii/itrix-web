/**
 * The shell contract — what the backend authorizes the surface to render.
 *
 * This REPLACES the v4.0 rails contract. `left_rail` and `right_rail` are gone:
 * the right value rail is retired and the left rail became navigation, so the
 * payload now names sidebar sections, the conversation header and the composer
 * label instead (Architecture v2.6 §11.6, §11.7).
 *
 * The single rule this file exists to enforce: THE SIDEBAR IS RENDERED, NOT
 * DECIDED. A section the backend did not authorize must not be renderable, and
 * nothing in the frontend may add one back.
 *
 * Surface 1 v5.0 §3.2 · Backend v6.0 §3.1
 */

import type {
  DisclosureCeiling, IdentityState, StateKey,
} from '@/types/journey.types';

/**
 * The thin strip above the transcript.
 *
 * It is the home of the two guarantees the retired right rail was carrying:
 * a NAMED human owner, and quick help that reaches one in a single action
 * (Architecture v2.6 §11.6A, R30).
 */
export interface ConversationHeaderContract {
  /** The thread title. Never an inferred organisation. */
  title: string;
  /** Plain language — "Assessment", never "State 7", never a tier or score. */
  stateLabel: string;
  /** Name and role only, from identification onward. */
  humanOwner?: string | null;
  /** e.g. "2h". Rendered as a badge from State 7. */
  supportSla?: string | null;
  /**
   * R30 is an absolute, not a layout preference. When the header collapses on a
   * narrow breakpoint this moves into the thread actions menu — it never
   * disappears.
   */
  quickHelp: boolean;
}

/**
 * Everything a shell render is driven by. Anything not in here is decoration.
 *
 * Deliberately ABSENT, and a defect if they ever appear on this plane:
 * persona_id, tier, lead score, license_out_probability, coverage_map,
 * question_budget_remaining, attachment_risk_flags (Architecture v2.6 §10.5).
 */
export interface ShellContract {
  threadId: string | null;
  /** 1–10, or null for DORMANT / no relationship yet. */
  journeyState: number | null;
  stateKey: StateKey;
  identityState: IdentityState;
  disclosureCeiling: DisclosureCeiling;
  /** Commitment cards stay unreachable until this is true. */
  valueDelivered: boolean;
  /** The state-appropriate composer label (Surface 1 v5.0 §3.5). */
  composerLabel: string;
  /** Whether suggestion chips should render. Phase 2 consumes it. */
  questionLoopOpen: boolean;
  /** Whether the attach control is active for this plane and state. Phase 2. */
  attachmentsEnabled: boolean;
  /** Ordered, closed vocabulary. The ONLY source of what the sidebar shows. */
  sidebarSections: string[];
  conversationHeader: ConversationHeaderContract | null;
}

/** GET /api/shell — the wire shape, before normalisation. */
export interface ShellContractPayload {
  threadId?: string | null;
  journeyState?: number | null;
  stateKey?: StateKey;
  identityState?: IdentityState;
  disclosureCeiling?: DisclosureCeiling;
  valueDelivered?: boolean;
  composerLabel?: string;
  questionLoopOpen?: boolean;
  attachmentsEnabled?: boolean;
  sidebarSections?: string[];
  conversationHeader?: ConversationHeaderContract | null;
}
