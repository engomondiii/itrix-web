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

export type PortalNextStepKey = 'read_briefing' | 'talk_to_itrix' | 'consider_evaluation';

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
  id: string;
  title: string;
  folder: string;
  disclosure: DocumentDisclosure;
  href: string | null; // null when locked (nda_only + no NDA)
  updatedAt: string;
}

export interface PortalDataRoom {
  ndaSigned: boolean;
  openFolders: { folder: string; documents: PortalDocument[] }[];
  /** Present only when NDA signed. */
  dataRoomFolders: { folder: string; documents: PortalDocument[] }[];
}

/** Evaluation tracking (§66). */
export type EvaluationStage = 'requested' | 'scoping' | 'in_progress' | 'report_ready';

export interface PortalEvaluation {
  exists: boolean;
  stage: EvaluationStage;
  reportHref: string | null;
  updatedAt: string | null;
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
  messages: ChatMessage[];
  teamJoined: boolean;
  teamMemberName: string | null;
}
