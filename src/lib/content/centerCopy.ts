/**
 * The approved invariant center — copy, single source.
 *
 * Source: itriX_Brand_Aligned_First_Landing_Page_v1.0 (the approved package) and
 * Playbook v1.5 §12. Surface 1 v4.0 §2.
 *
 *   NON-NEGOTIABLE
 *   Retain the approved center and the exact opening question. The first prompt
 *   is the actual beginning of the review. Do not replace it with a new opening
 *   and do not ask the visitor to repeat the same input.
 *
 * Every string a visitor reads on the first screen lives here so a wording change
 * is one edit with one owner, and so no component can quietly drift from the
 * approved copy. Do not inline any of these in a component.
 */

/**
 * The approved confidentiality wording, re-exported here so every surface that
 * needs it imports from ONE place: the composer footer, the attachment flow and
 * the artifact views all read this symbol.
 *
 * DO NOT REWORD WITHOUT LEGAL SIGN-OFF (Architecture v2.6 §19.4). Because the
 * composer is present at every state from 1 to 10, this notice is now present at
 * every state.
 */
export { CONFIDENTIALITY_NOTICE } from '@/lib/content/ctaCopy';

export const CENTER_COPY = {
  /** Technical label above the H1 (IBM Plex Mono, uppercase, tracked). */
  eyebrow: 'Mathematical intelligence',

  /** H1 — the situation framing. Display face, 56px desktop / 32px mobile. */
  situationFraming: 'You already know computation is holding you back.',

  /**
   * THE MAIN QUESTION. The single most important sentence on the platform.
   * It invites a problem; it does not announce a product.
   * Approved 2026-07. Requires Brand & Messaging + Park Dae-hyuk sign-off to change.
   */
  mainQuestion: 'What would you like computation to do better?',

  /** The supporting line beneath the question. */
  supportingLine:
    'Start with the workload, system constraint, or strategic opportunity you came to itriX to examine.',

  /** Placeholder inside the composer. Grey hint text, never a label. */
  promptPlaceholder: 'Describe the bottleneck or opportunity in one non-confidential sentence…',

  /** Accessible name for the composer textarea (visually hidden). */
  promptAriaLabel: 'Describe your compute challenge',

  /** The short safety note directly under the composer. */
  safetyNote: 'A non-confidential summary is enough to begin.',

  /**
   * RETIRED IN v5.0. There is no labelled start button any more — the send
   * control is an icon-only arrow (Surface 1 v5.0 §00.1 change 5). Its
   * accessible name lives in COMPOSER_COPY.sendLabel, the one place it exists.
   */

  /** Section label above the example chips. */
  examplesLabel: 'Examples from the work our visitors bring',

  /** The four-step pathway hint below the examples. */
  pathwayHint: ['You share', 'itriX reflects', 'You receive a tailored brief', 'You decide what happens next'],

  /**
   * RETIRED IN v5.0. There is NO user-facing character limit and no counter
   * (R28). The server keeps a safety cap of 100,000 characters and reports it as
   * a recoverable message; the UI never pre-empts or truncates the visitor's
   * sentence. See COMPOSER_COPY.serverCap.
   */

  /** Validation message when the visitor submits an empty or too-short sentence. */
  tooShort: 'Add a little more so we can read the structure of the problem.',

  /** Scroll affordance to the calm narrative below the fold. */
  learnMore: 'What itriX does',
} as const;


/*
 * RETIRED IN v5.0 — the two arrival rail copy blocks.
 *
 * The right value rail is gone and the left rail became navigation. Everything
 * those blocks said is RE-HOMED rather than deleted (Architecture v2.6 §11.6A):
 * the confidentiality line sits under the composer, the NDA link is in the
 * sidebar's Explore group, and sidebar strings live in
 * lib/content/composerCopy.ts (SIDEBAR_COPY).
 */

/** The drawer that the right-rail link opens (controlled-public). */
export const NDA_DRAWER = {
  tier: 'Controlled public',
  title: 'What can be shared before an NDA?',
  body:
    'You can describe the business pressure, workload family, current environment, and the outcome you would like to improve. Please do not share proprietary code, internal benchmark data, architecture details, or other confidential material before an NDA.',
  dismiss: 'Understood',
} as const;

/**
 * The review surface (Playbook v1.5 §13). The review CONTINUES from the
 * center sentence — it never re-asks for it.
 */
export const REVIEW_COPY = {
  sectionTitle: 'Compute Bottleneck Review',
  capturedLabel: 'What we heard',
  capturedIntro: 'Here is what we heard. Edit it if we captured it imperfectly.',
  addMore: 'Add anything else that would help us understand it.',
  continue: 'Continue',
  /** Shown ONLY when the visitor landed on /review directly, with no center sentence. */
  coldStartQuestion: CENTER_COPY.mainQuestion,
  /** The field label in that same cold-start case. */
  coldStartLabel: 'Describe the bottleneck or opportunity in one non-confidential sentence',
} as const;
