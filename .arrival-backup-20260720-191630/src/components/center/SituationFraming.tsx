import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * The eyebrow and the situation framing — the top of the approved center.
 *
 *   MATHEMATICAL INTELLIGENCE
 *   "You already know computation is holding you back."
 *
 * PHASE 2 CORRECTION. Phase 1 demoted this line to secondary text and gave the
 * document's h1 to the main question. That inverted the approved package:
 * Playbook v1.6 §12 labels this line "SITUATION FRAMING — H1", and the approved
 * landing prototype composes the same way — a small tracked eyebrow, then one
 * dominant heading, then supporting copy.
 *
 * The question keeps its own prominence directly beneath (§2.1 element 2); it is
 * still the single most important sentence on the platform. What changed is
 * which line carries the heading level and the display size.
 *
 * There is exactly one visually dominant message per screen (Brand Manual §6),
 * and on the first screen this is it.
 */
export function SituationFraming() {
  return (
    <>
      <p className="arrival__eyebrow">{CENTER_COPY.eyebrow}</p>
      <h1 className="arrival__framing">{CENTER_COPY.situationFraming}</h1>
    </>
  );
}
