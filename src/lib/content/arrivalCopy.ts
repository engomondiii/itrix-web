/**
 * The arrival screen's own copy — the two relationship rails, the header, the
 * footer and the NDA dialog.
 *
 * Verbatim from the approved landing package
 * (itriX_Brand_Aligned_First_Landing_Page_v1.0). The centre copy is NOT here —
 * it lives in centerCopy.ts, which stays the single source for the framing, the
 * question, the supporting line, the examples and the pathway hint.
 *
 * WHY THE RAILS EXIST AGAIN
 * v5.0 retired the two-rail shell for the CONVERSATION. It did not retire the
 * arrival screen's rails, which are a different thing: they are quiet, static,
 * and they say only what the visitor controls. The approved package is explicit
 * — "Left and right relationship rails are deliberately quiet at arrival so they
 * can grow in later journey states." In v5.0 they do not grow; the conversation
 * replaces them the moment the visitor speaks.
 */

export const ARRIVAL_NAV = {
  descriptor: ['Computational AI', 'Infrastructure'],
  links: [
    { label: 'Approach', href: '/about' },
    { label: 'Technology', href: '/technology' },
    { label: 'Resources', href: '/resources' },
  ],
  gated: { label: 'NDA access', href: '/sign-in' },
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
} as const;

/** The left rail at arrival — stage only. No history, no inferred company. */
export const ARRIVAL_LEFT_RAIL = {
  label: 'Your itriX path',
  stageNumber: '01',
  stageTitle: 'Start',
  stageBody: 'Share the challenge you came to examine.',
  caption: 'The relationship grows only when you choose to continue.',
  routeLabel: 'Journey begins at review',
} as const;

/** The right rail at arrival — disclosure and control. Never a sales panel. */
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

/**
 * The controlled-public drawer behind the right rail's link.
 *
 * DO NOT REWORD WITHOUT LEGAL SIGN-OFF — it states the pre-NDA boundary.
 */
export const ARRIVAL_NDA_DIALOG = {
  tier: 'Controlled public',
  title: 'What can be shared before an NDA?',
  body:
    'You can describe the business pressure, workload family, current environment, and the outcome you would like to improve. Please do not share proprietary code, internal benchmark data, architecture details, or other confidential material before an NDA.',
  dismiss: 'Understood',
  close: 'Close dialog',
} as const;

export const ARRIVAL_FOOTER = {
  copyright: '© 2026 itriX. Computational AI Infrastructure.',
  links: [
    { label: 'Privacy', href: null },
    { label: 'Security', href: null },
    { label: 'Disclosure policy', href: null },
  ],
} as const;
