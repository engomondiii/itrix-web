/**
 * Suggested-question copy (Playbook v1.6 §13.2).
 *
 * The behaviour note is the important half: selecting a suggestion FILLS the
 * prompt window and moves the cursor into it. It never sends on its own. This
 * matches the example chips on the landing exactly, so the interaction is
 * learned once.
 *
 * There is no empty state. An empty suggestion group does not render at all —
 * a labelled box with nothing in it is worse than silence.
 */
export const SUGGESTION_COPY = {
  groupLabel: 'You could also tell us',
  /** Accessible description for the group, read once by a screen reader. */
  groupHint: 'Selecting one of these fills the message box. It does not send.',
} as const;
