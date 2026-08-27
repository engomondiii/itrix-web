/**
 * The shell contract — what the backend authorizes the surface to render.
 *
 * v7.0 SPLITS THE ZONE VOCABULARY. `sidebar_sections` is superseded by
 * `conversation_rail_sections` and `content_pane_sections`, and the payload now
 * carries `shell_mode` (Architecture v2.7 §11.6, §11.7).
 *
 * The retired `left_rail` and `right_rail` names are NOT reintroduced. The
 * content pane is a new zone, not the old value rail: everything Architecture
 * v2.6 §11.6A re-homed stays re-homed.
 *
 * The single rule this file exists to enforce: THE ZONES ARE RENDERED, NOT
 * DECIDED. A section the backend did not authorize must not be renderable, and
 * nothing in the frontend may add one back.
 *
 * Surface 1 v6.0 §3.1–3.3 · Backend v7.0 §4.1
 */

import type {
  DisclosureCeiling, IdentityState, StateKey,
} from '@/types/journey.types';
import type { ShellMode } from '@/lib/journey/shellModes';
import type { ConversationRailSection } from '@/lib/journey/railSections';

/**
 * The thin strip above the transcript.
 *
 * It is the home of the two guarantees the retired right rail was carrying:
 * a NAMED human owner, and quick help that reaches one in a single action
 * (Architecture v2.7 §11.6A, R30). The content pane never becomes its home.
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
   * disappears, and it never moves into the content pane.
   */
  quickHelp: boolean;
}

/**
 * Everything a shell render is driven by. Anything not in here is decoration.
 *
 * Deliberately ABSENT, and a defect if they ever appear on this plane:
 * persona_id, tier, lead score, license_out_probability, coverage_map,
 * question_budget_remaining, attachment_risk_flags, matched_text,
 * content_pane_debug, thread_switch_history (Architecture v2.7 §10.5).
 */
export interface ShellContract {
  threadId: string | null;
  /**
   * `arrival` renders the question alone; `working` renders rail + column +
   * content pane. NULL means the backend has not answered yet — the caller falls
   * back to the local threshold rather than inheriting a mode nobody chose.
   */
  shellMode: ShellMode | null;
  /** 1–10, or null for DORMANT / no relationship yet. */
  journeyState: number | null;
  stateKey: StateKey;
  identityState: IdentityState;
  disclosureCeiling: DisclosureCeiling;
  /** Commitment cards stay unreachable until this is true. */
  valueDelivered: boolean;
  /** The state-appropriate composer label (Surface 1 v6.0 §3.5). */
  composerLabel: string;
  /** Whether suggestion chips should render. */
  questionLoopOpen: boolean;
  /** Whether the attach control is active for this plane and state. */
  attachmentsEnabled: boolean;
  /**
   * Ordered, closed, and it NEVER GROWS: new_chat, conversations, account.
   * The only source of what the conversation rail shows.
   */
  conversationRailSections: ConversationRailSection[];
  /**
   * Ordered. PHASE 2 renders these; Phase 1 carries them through so the contract
   * is complete the moment the pane lands, and so a payload from a v7.0 backend
   * is never silently discarded.
   */
  contentPaneSections: string[];
  /** Which artifact the pane opens on. Phase 2 consumes it. */
  contentPaneDefaultArtifactId: string | null;
  conversationHeader: ConversationHeaderContract | null;
  relationshipState?: 'visitor' | 'technical_evaluator' | 'customer' | 'strategic_customer';
  engagementStage?: string;
  selectedStageLabel?: string;
  selectedAction?: string;
  modeChangeStatus?: string;
  modeChangeTarget?: string;
  mirrorStatus?: string;
  identityNeededAction?: string;
  ctaDeclined?: boolean;
  evaluationType?: string;
  contractStage?: string;
  locale?: 'en' | 'ko' | string;
  recommendationAllowed?: boolean;
}

/** GET /api/shell — the wire shape, before normalisation. */
export interface ShellContractPayload {
  threadId?: string | null;
  shellMode?: string | null;
  journeyState?: number | null;
  stateKey?: StateKey;
  identityState?: IdentityState;
  disclosureCeiling?: DisclosureCeiling;
  valueDelivered?: boolean;
  composerLabel?: string;
  questionLoopOpen?: boolean;
  attachmentsEnabled?: boolean;
  conversationRailSections?: string[];
  contentPaneSections?: string[];
  contentPaneDefaultArtifactId?: string | null;
  /**
   * The v6.0 key. Backend v7.0 Phase 1 emits it as an alias of
   * `conversation_rail_sections` for exactly one release, and Phase 3 removes it.
   * It is read here so this surface keeps working against a backend that has not
   * migrated yet — never to widen what the new key said.
   */
  sidebarSections?: string[];
  conversationHeader?: ConversationHeaderContract | null;
  relationshipState?: ShellContract['relationshipState'];
  engagementStage?: string;
  selectedStageLabel?: string;
  selectedAction?: string;
  modeChangeStatus?: string;
  modeChangeTarget?: string;
  mirrorStatus?: string;
  identityNeededAction?: string;
  ctaDeclined?: boolean;
  evaluationType?: string;
  contractStage?: string;
  locale?: string;
  recommendationAllowed?: boolean;
}
