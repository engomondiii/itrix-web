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

  /** The primary action. The ONLY start label (Playbook §08). */
  primaryAction: 'Begin review',

  /** Section label above the example chips. */
  examplesLabel: 'Examples from the work our visitors bring',

  /** The four-step pathway hint below the examples. */
  pathwayHint: ['You share', 'itriX reflects', 'You receive a tailored brief', 'You decide what happens next'],

  /** Character ceiling on the composer, matching the approved package. */
  maxLength: 600,

  /** Validation message when the visitor submits an empty or too-short sentence. */
  tooShort: 'Add a little more so we can read the structure of the problem.',

  /** Scroll affordance to the calm narrative below the fold. */
  learnMore: 'What itriX does',
} as const;

/**
 * The left rail at State 1 — ambient structure only.
 * No functional panel, no inferred company, no persona, no history.
 */
export const ARRIVAL_LEFT_RAIL = {
  label: 'Your itriX path',
  stageNumber: '01',
  stageTitle: 'Start',
  stageBody: 'Share the challenge you came to examine.',
  caption: 'The relationship grows only when you choose to continue.',
} as const;

/**
 * The right rail at State 1 — disclosure and control only.
 * Never a sales panel.
 */
export const ARRIVAL_RIGHT_RAIL = {
  label: 'Your control',
  statusTitle: 'Public-safe start',
  statusBody: 'No account required',
  points: [
    'Share only what you choose.',
    'Nothing confidential is needed.',
    'An NDA appears only when useful.',
  ],
  ndaLink: 'What can be shared before an NDA?',
} as const;

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
