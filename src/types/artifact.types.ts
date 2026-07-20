/**
 * Artifacts and inline cards — the governed payloads that render in-thread.
 *
 * An ARTIFACT is a structured deliverable: a reflection, a pitch room, a review
 * summary. An INLINE CARD is a single governed next step or notice.
 *
 * Neither is a page. Both are appended to the transcript and stay there, because
 * the transcript is the visitor's record (Architecture v2.6 §2.5, law 3).
 *
 * The commitment gate is enforced on the PAYLOAD by the backend serializer, not
 * by this surface declining to render (Architecture v2.6 §5). A commercial card
 * that arrives suppressed simply is not in the payload — the frontend never
 * softens, greys out, or explains a suppression to the visitor.
 */

import type { ArtifactType } from '@/lib/journey/artifactTypes';
import type { DisclosureCeiling } from '@/types/journey.types';

export type GovernanceState = 'approved' | 'under_review' | 'blocked';

export interface Artifact {
  id: string;
  threadId: string;
  type: ArtifactType;
  /** Bumped on regeneration. The prior version is superseded, never overwritten. */
  version: number;
  /** Structured, type-specific. Rendered by the matching artifact component. */
  payload: Record<string, unknown>;
  disclosureLevel: DisclosureCeiling;
  governanceStatus: GovernanceState;
  /** Present only when the artifact is shareable — e.g. the emailed pitch room. */
  capabilityToken?: string | null;
  /** Ordering within the transcript. Shares the thread's sequence space. */
  seq: number;
  createdAt: string;
}

/** The closed inline-card vocabulary, mirrored from the backend. */
export const CARD_TYPES = [
  'next_best_action',
  'recommended_pathway',
  'disclosure_boundary',
  'specialist',
  'scheduling',
  'nda_checklist',
  'account_create',
  'relationship_team',   // Phase 3
  'support',             // Phase 3
  'satisfaction_pulse',  // Phase 3
  'success_review',      // Phase 3
] as const;

export type CardType = (typeof CARD_TYPES)[number];

const KNOWN_CARDS: ReadonlySet<string> = new Set(CARD_TYPES);
export function isCardType(value: string): value is CardType {
  return KNOWN_CARDS.has(value);
}

export interface InlineCardAction {
  label: string;
  href?: string | null;
  /**
   * True when this action asks for commitment. The backend has already applied
   * the value-first gate and the customer-first suppression rule before sending
   * it; this flag exists for telemetry and for the ONE-ACTION rule below.
   */
  commercial?: boolean;
}

export interface InlineCard {
  id: string;
  threadId: string;
  type: CardType;
  title: string;
  body?: string | null;
  /**
   * ONE ACTION PER CARD (Playbook v1.6 §16F). A card carrying a list of offers
   * is a defect, so this is a single optional action rather than an array.
   */
  action?: InlineCardAction | null;
  /** Type-specific extras: the named specialist, the NDA checklist rows, etc. */
  payload?: Record<string, unknown>;
  seq: number;
  createdAt: string;
}
