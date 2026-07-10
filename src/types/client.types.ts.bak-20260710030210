import type { ProductRoute, LicensePathway } from './product.types';
import type { LeadTier } from './lead.types';

/**
 * The customized client page (Pitch Room) payload — mirrors the backend
 * result_page / Diagnosis-agent output, structured as Problemology pitch slides.
 * Reached via a capability token at /c/[token].
 */

export type PitchDisclosure = 'public' | 'controlled_public';

/** One structural-diagnosis row (relevance filled from the visitor's answers). */
export interface DiagnosisRelevanceRow {
  label: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface KpiPreviewRow {
  label: string;
  metric: string; // qualitative — what an evaluation could measure, never a promise
}

export interface ProofPreviewRow {
  title: string;
  disclosure: 'public' | 'nda_only';
  reference?: string;
}

/** One assembled pitch slide (5–7 per room). */
export interface PitchSlide {
  key: string;
  title: string;
  body: string;
  disclosure: PitchDisclosure;
}

/** The full customized-page payload. */
export interface ClientPage {
  token: string;
  leadId: string;
  /** Which of the nine pitch variants was selected (internal; not labelled to visitor). */
  pitchType: string;
  visitorPain: string;
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
  tier: LeadTier;
  problemMirror: string;
  diagnosis: DiagnosisRelevanceRow[];
  alphaFitSummary: string;
  kpiPreview: KpiPreviewRow[];
  proofPreview: ProofPreviewRow[];
  recommendedNextStep: string;
  /** The assembled 5–7 slide deck. */
  slides: PitchSlide[];
  /** The id of the conversation embedded on this page. */
  conversationId: string | null;
}

/** A minimal Client (portal account) reference. */
export interface ClientRef {
  id: string;
  leadId: string;
  email: string | null;
}

/**
 * Phase 2: the full Client entity as projected to the portal after a successful
 * invite claim (mirrors backend apps.clients.Client). The authoritative record
 * lives on the backend; this is what the client-JWT session carries.
 */
export interface Client {
  id: string;
  leadId: string;
  email: string;
  fullName: string | null;
  organization: string | null;
  role: string | null;
  ndaSigned: boolean;
  createdAt: string;
}

/** Result of consuming an account invite (reveal ③). */
export interface InviteClaimResult {
  client: Client;
  /** Whether the client must set a password before entering (first-time). */
  requiresPasswordSet: boolean;
}
