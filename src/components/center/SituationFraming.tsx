import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * The eyebrow and the situation framing — the top of the approved center.
 *
 *   MATHEMATICAL INTELLIGENCE
 *   "You already know computation is holding you back."
 *
 * Playbook v1.6 §12 labels this line "SITUATION FRAMING — H1", and the approved
 * landing package composes it the same way: a small tracked eyebrow, then one
 * dominant heading, then the question and the supporting copy beneath.
 *
 * `id` defaults to `hero-title` so the arrival screen's centre section can point
 * aria-labelledby at it. The composer is labelled by the QUESTION, not by this —
 * the question is what the prompt box is actually asking.
 *
 * There is exactly one visually dominant message per screen (Brand Manual §6),
 * and on the first screen this is it.
 */
export function SituationFraming({ id = 'hero-title' }: { id?: string }) {
  return (
    <>
      <p className="arrival__eyebrow arrival-label">{CENTER_COPY.eyebrow}</p>
      <h1 id={id} className="arrival__framing">
        {CENTER_COPY.situationFraming}
      </h1>
    </>
  );
}
