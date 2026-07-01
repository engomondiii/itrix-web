import { routes } from '@/constants/routes';

export interface Cta {
  label: string;
  href: string;
  sublabel?: string;
}

/**
 * The single CTA vocabulary (Playbook §08). "Begin Compute Review" is the ONLY
 * primary start label. Path-specific actions stay distinct by context. Never
 * "Contact Sales", "Buy now", or "Get a demo".
 */
export const CTA = {
  beginReview: { label: 'Begin Compute Review', href: routes.review, sublabel: 'A structural read on your workload — no quote, no sales call' },
  continue: { label: 'Continue', href: routes.review },
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
  // Retained for existing product/licensing pages (pulled-not-pushed contextual actions).
  licensing: { label: 'Licensing pathways', href: routes.licensing },
  contactTeam: { label: 'Talk to the team', href: routes.review },
} as const satisfies Record<string, Cta>;

/**
 * The confidentiality notice — EXACT wording, used everywhere a visitor can
 * describe a problem (Playbook §09). A safety control, not marketing copy.
 * DO NOT reword without Legal + Benjamin sign-off.
 */
export const CONFIDENTIALITY_NOTICE =
  'Please do not submit confidential technical information before an NDA. The initial assessment is based on non-confidential workload descriptions only.';

/** The pre-NDA reminder shown beneath the first-screen prompt window. */
export const PROMPT_CONFIDENTIALITY_HINT =
  'Please share only non-confidential descriptions until an NDA is in place.';

/** A single shared closing line used across page CTAs. */
export const CLOSING_LINE = 'Representation before execution. Start with the workload.';
