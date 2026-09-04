/**
 * Portal (Surface 3) types — client-side mirror of the backend apps.clients +
 * apps.conversations + evaluation/poc projections. The backend is authoritative;
 * these shapes describe what the client-JWT portal endpoints return.
 */

import type { ChatMessage } from './chat.types';
import type { ProductRoute, LicensePathway } from './product.types';

/** The signed-in client identity (from GET /portal/me, client-JWT). */
export interface ClientIdentity {
  id: string;
  leadId: string;
  email: string;
  fullName: string | null;
  organization: string | null;
  role: string | null;
  /** NDA state gates the data room + disclosure ceiling. */
  ndaSigned: boolean;
  /**
   * v8.0 Phase 5. Whether this address has been confirmed (Architecture v2.9 R66).
   *
   * OPTIONAL on purpose: Backend v7.2 Phase 4 is what adds it to `client/me/`, and until
   * that lands the key is simply absent. Absent must be read as UNKNOWN rather than as
   * unconfirmed — treating a missing key as `false` would put a permanent "confirm your
   * email" banner on every existing customer's workspace the day this ships.
   *
   * It is a fact about the holder's own address, so it is theirs to see. It is not a
   * disclosure about anybody else.
   */
  emailVerified?: boolean;
}

/** Portal journey/stage line shown on the overview (§62 status line). */
export type PortalStage =
  | 'review_ready'
  | 'briefing_preparing'
  | 'conversation_arranging'
  | 'evaluation_in_progress'
  | 'poc_underway';

export interface PortalOverview {
  client: ClientIdentity;
  stage: PortalStage;
  unreadMessages: number;
  /** True once the living briefing exists. */
  briefingAvailable: boolean;
  /** Next-step cards to surface (keys map to portalCopy). */
  nextSteps: PortalNextStepKey[];
  lastUpdated: string | null;
}

export type PortalNextStepKey = 'read_briefing' | 'talk_to_itrix' | 'consider_astop' | 'consider_alpha_assessment';

/** A conversation summary in the portal messages list. */
export interface PortalConversation {
  id: string;
  subject: string | null;
  lastMessagePreview: string | null;
  unread: number;
  teamJoined: boolean;
  updatedAt: string;
}

/** The living briefing (§64) — mirrors the customized page sections. */
export interface PortalBriefingSection {
  key: string;
  title: string;
  body: string;
  updated?: boolean;
}

export interface PortalBriefing {
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
  sections: PortalBriefingSection[];
  lastUpdated: string | null;
  updatedNotice: boolean;
}

/** Documents + data room (§65). */
export type DocumentDisclosure = 'public' | 'controlled_public' | 'nda_only';

export interface PortalDocument {
  /** Server rows intentionally expose only the document-facing metadata required here. */
  id?: string;
  title: string;
  folder?: string;
  disclosure: DocumentDisclosure;
  /** Blank/null until a separately authorized delivery endpoint exists. */
  href: string | null;
  /** Explicit server authorization state; never derive this from ndaSigned. */
  locked: boolean;
  updatedAt?: string;
}

/** The answer to an in-place NDA request (2026-08-10). */
export interface PortalNdaRequestPayload {
  problemContext?: string;
  workloadContext?: string;
  desiredOutcome?: string;
  discussionReason?: string;
}

export interface PortalNdaRequestResult {
  ndaRequested?: boolean;
  /** The sentence to show the customer — authored by the backend so the screen
      and the inbox note can never promise different things. */
  message?: string;
  detail?: string;
  code?: string;
  contextRequired?: boolean;
}

export interface PortalDataRoom {
  /** Agreement/protection state only; never an authorization bit. */
  ndaSigned: boolean;
  /** Server-computed explicit content authorization for at least one restricted document. */
  dataRoomAuthorized: boolean;
  openFolders: { folder: string; documents: PortalDocument[] }[];
  /** Restricted rows may still be present while locked; href remains null until authorized. */
  dataRoomFolders: { folder: string; documents: PortalDocument[] }[];
  ndaContextPresent?: boolean;
  ndaProblemContext?: string;
  ndaWorkloadContext?: string;
  ndaDesiredOutcome?: string;
  ndaDiscussionReason?: string;
}

/** Evaluation tracking (§66) plus the controlled ASTOP proof journey. */
export type EvaluationStage = 'requested' | 'scoping' | 'in_progress' | 'report_ready';
export type AstopStage = 'identify_qualify' | 'nda_briefing' | 'controlled_evaluation' | 'lo_deployment' | 'verify_expand' | 'closed';

export interface PortalEvaluation {
  exists: boolean;
  kind: 'astop' | 'alpha_compute';
  stage: string;
  astopStage?: AstopStage | '';
  kpis?: Record<string, unknown>[];
  reportHref: string | null;
  updatedAt?: string | null;
  ttfvSeconds?: number | null;
  verifiedValue?: Record<string, unknown>;
  /** Customer-visible fee treatment. It does not determine technical eligibility. */
  customerFeeStatus?: string;
  finalAssessmentFee?: string | number | null;
  /** Optional customer-safe governed assessment dimensions; no policy reasoning. */
  eligibilityState?: string | null;
  eligibility_state?: string | null;
  assessmentState?: string | null;
  assessment_state?: string | null;
  feeState?: string | null;
  fee_state?: string | null;
  waiverState?: string | null;
  waiver_state?: string | null;
  entitlementState?: string | null;
  entitlement_state?: string | null;
}

/** PoC tracking (§67). */
export type PoCMilestone = 'planning' | 'setup' | 'execution' | 'review' | 'decision';

export interface PortalPoC {
  exists: boolean;
  milestone: PoCMilestone;
  successCriteria: string[];
  updatedAt: string | null;
}

/** Settings (§68). */
export interface PortalNotificationPrefs {
  newTeamMessage: boolean;
  reviewUpdated: boolean;
  evalOrPocStatus: boolean;
  documentShared: boolean;
}

export interface PortalSettings {
  profile: {
    fullName: string | null;
    email: string;
    organization: string | null;
    role: string | null;
  };
  team: { email: string; status: 'invited' | 'active' }[];
  notifications: PortalNotificationPrefs;
}

/** A full portal messages thread (reuses the governed ChatMessage shape). */
export interface PortalThread {
  conversationId: string;
  /** The conversation's spine id — attachments stage against it. Null only for
      threads that predate the spine; the backend creates it on first GET. */
  threadId: string | null;
  messages: ChatMessage[];
  teamJoined: boolean;
  teamMemberName: string | null;
}
