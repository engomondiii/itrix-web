/**
 * THE TYPE SCALE, as typed constants (Architecture v2.7 §21.12).
 *
 * The authoritative values are the CSS custom properties in styles/shell.css.
 * This module exists so a test can assert the rendered size against the number
 * the specification names, rather than against whatever the stylesheet happens
 * to say today.
 *
 * THE REFERENCE POINT, stated honestly: the conversation body is set against the
 * reading experience of the mainstream assistant surfaces — a 16px body on a
 * ~27px line in a measure of roughly 68–72 characters. Those figures are a
 * design target taken from observation, not a citation, and they should be
 * re-measured against the current builds of the reference products at design
 * sign-off.
 *
 * Two rules outrank the table:
 *   · the visitor's turn and the assistant's turn use the SAME size and weight,
 *     distinguished by alignment, label and spacing only;
 *   · no informational text is set below 13px at any breakpoint.
 */

export const TYPE_SCALE = {
  /** The arrival question — promoted to h1 in v6.0. Brand Manual H1: 56 / 32. */
  arrivalQuestion: { token: '--arrival-question-size', min: 32, max: 56, lineHeight: 1.02 },
  /** The supporting line beneath the question. */
  supportingLine: { token: '--supporting-line-size', min: 16, max: 18, lineHeight: 1.55 },
  /** The composer textarea. WAS 18px in v5.0. */
  composerText: { token: '--composer-text-size', px: 16, lineHeight: 1.6 },
  /** Transcript body. Visitor and assistant share it — see the rule above. */
  turnBody: { token: '--turn-body-size', px: 16, lineHeight: 1.7 },
  /** Reading measure for the transcript, capped in px. */
  turnMeasure: { token: '--turn-measure', maxPx: 720 },
  /** One rotating prompt. Was 12.5px in a 5-up grid. */
  prompt: { token: '--prompt-size', min: 16, max: 17 },
  /** A conversation title in the rail, clamped to two lines. */
  railItem: { token: '--rail-item-size', px: 14, lineHeight: 1.4 },
  /** The composer keyboard hint. The floor for informational text. */
  hint: { token: '--hint-size', px: 13 },
} as const;

/** The retired v5.0 heading scale, kept named so nothing quietly reinstates it. */
export const RETIRED_TOKENS = ['--arrival-heading-size', '--arrival-heading-brand', '--situation-framing-size'] as const;
