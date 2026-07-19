import { routes } from '@/constants/routes';

export interface Cta {
  label: string;
  href: string;
  sublabel?: string;
}

/**
 * THE SINGLE CTA VOCABULARY (Playbook v1.5 §08, Surface 1 v4.0 §5 Phase 1).
 *
 *   "Begin review"  — the ONE label that starts the journey.
 *   "Continue"      — the ONE label that moves it forward mid-flow.
 *
 * v4.0 change: the start label is "Begin review", matching the approved center
 * package. The older "Begin Compute Review" is retired — it is longer, it names
 * the product before the visitor has spoken, and it appeared in three different
 * casings across the surface.
 *
 * Never "Contact Sales", "Buy now", "Get a demo", "Request pricing", or any
 * urgency construction. Path-specific actions below stay distinct BY CONTEXT,
 * not by inventing a second start label.
 */
export const CTA = {
  /** The one start label. */
  beginReview: {
    label: 'Begin review',
    href: routes.review,
    sublabel: 'A structural read on your workload — no quote, no sales call',
  },
  /** The one mid-flow label. */
  continue: { label: 'Continue', href: routes.review },

  // ── Contextual path actions (pulled, never pushed) ────────────────────────
  requestTechnicalBriefing: { label: 'Request Technical Briefing', href: routes.review },
  requestInvestorBriefing: { label: 'Request Investor Briefing', href: routes.review },
  requestMediaKit: { label: 'Request Media / Story Kit', href: routes.review },
  requestAssessment: { label: 'Request an Alpha Compute Assessment', href: routes.review },
  continueWithSpecialist: { label: 'Continue with an itriX Specialist', href: routes.review },
  discussNonExclusive: { label: 'Discuss a Non-Exclusive Evaluation', href: routes.licensingNonExclusive },
  discussExclusive: { label: 'Discuss Exclusive ALPHA Rights', href: routes.licensingExclusive },
  bookConversation: { label: 'Book a confidential conversation', href: routes.review },
  createWorkspace: { label: 'Create your itriX workspace', href: routes.review },
  exploreTechnology: { label: 'Explore the technology', href: routes.technology },
  seeCompute: { label: 'See ALPHA Compute', href: routes.alphaCompute },
  seeCore: { label: 'See ALPHA Core', href: routes.alphaCore },
  readPaper: { label: 'Read the FQNM paper', href: routes.fqnmPaper },
  enterRooms: { label: 'Find your room', href: routes.rooms },
  licensing: { label: 'Licensing pathways', href: routes.licensing },
  contactTeam: { label: 'Talk to the team', href: routes.review },
} as const satisfies Record<string, Cta>;

/**
 * The confidentiality notice — EXACT wording, used everywhere a visitor can
 * describe a problem (Playbook v1.5 §19.4). A SAFETY CONTROL, not marketing copy.
 * DO NOT reword without Legal + Benjamin sign-off.
 *
 * Rendered through <ConfidentialityNote variant="full" /> so it exists once.
 */
export const CONFIDENTIALITY_NOTICE =
  'Please do not submit confidential technical information before an NDA. The initial assessment is based on non-confidential workload descriptions only.';

/**
 * The short note beneath the composer on the approved center.
 * Also exposed as CENTER_COPY.safetyNote; this alias is kept so existing call
 * sites keep working.
 */
export const PROMPT_CONFIDENTIALITY_HINT = 'A non-confidential summary is enough to begin.';

/** A single shared closing line used across page CTAs. */
export const CLOSING_LINE = 'Representation before execution. Start with the workload.';
