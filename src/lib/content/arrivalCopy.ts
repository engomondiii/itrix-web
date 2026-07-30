/**
 * The arrival screen's remaining own copy.
 *
 * v6.0 REMOVED FOUR BLOCKS, because the four things they described are gone from
 * the product (Playbook v1.7 §00, Surface 1 v6.0 §00.1):
 *
 *   ARRIVAL_NAV         the top navigation links and the "NDA access" button.
 *                       The links are removed; the button became "Sign in" and
 *                       its label now lives in CENTER_COPY.signIn.
 *   ARRIVAL_LEFT_RAIL   the quiet stage rail. The arrival screen has no rails.
 *   ARRIVAL_RIGHT_RAIL  the disclosure-and-control rail. Same reason.
 *   ARRIVAL_FOOTER      the dark footer. Replaced by the pinned legal strip,
 *                       whose labels live in LEGAL_COPY.
 *
 * The wordmark descriptor moved to CENTER_COPY.descriptor and dropped "AI".
 *
 * WHAT SURVIVES is the controlled-public drawer text below. It states the
 * pre-NDA boundary in approved wording, it is quoted by the disclosure-policy
 * route, and it is the one string in this file with legal weight.
 */

/**
 * The controlled-public drawer describing the pre-NDA boundary.
 *
 * DO NOT REWORD WITHOUT LEGAL SIGN-OFF.
 */
export const ARRIVAL_NDA_DIALOG = {
  tier: 'Controlled public',
  title: 'What can be shared before an NDA?',
  body:
    'You can describe the business pressure, workload family, current environment, and the outcome you would like to improve. Please do not share proprietary code, internal benchmark data, architecture details, or other confidential material before an NDA.',
  dismiss: 'Understood',
  close: 'Close dialog',
} as const;
