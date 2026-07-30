import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * THE MAIN QUESTION — the single most important sentence on the platform, and
 * from v6.0 the arrival route's ONLY h1.
 *
 *   "What would you like computation to do better?"
 *
 * ── WHAT CHANGED, AND WHY IT IS NOT A SIZE SWAP ─────────────────────────────
 * v5.0 put the SITUATION FRAMING in the h1 and rendered this as a prominent
 * paragraph beneath it, because Playbook v1.6 §12 labelled that line
 * "SITUATION FRAMING — H1". v6.0 DELETES the framing line from the product
 * (Playbook v1.7 §00 change 1, R31) and the question inherits the display scale.
 *
 * So this is not the two lines trading font sizes. There is now exactly ONE large
 * sentence on the first screen, and it is a question — which is the whole
 * argument of the change: nothing on the front door competes with the one thing
 * being asked.
 *
 * The eyebrow moved here with the promotion. It was in SituationFraming, which no
 * longer exists, and it is a label for the heading rather than a heading of its
 * own — so it renders as a paragraph immediately above.
 *
 * SIZE: `--arrival-question-size`, which resolves to clamp(32px, 5vw, 56px) and
 * lands exactly on the Brand Manual H1 of 56px desktop / 32px mobile. The
 * prototype's clamp(44px, 6vw, 76px) went with the framing line it was built for;
 * reusing it would have put a question at 76px, which reads as a slogan rather
 * than a question (Architecture v2.7 §21.12).
 *
 * `id` is exposed so the composer can point aria-labelledby at it — the question
 * IS the label for the prompt box, which is why the textarea's own label is
 * visually hidden rather than duplicated on screen.
 */
export function MainQuestion({ id = 'main-question' }: { id?: string }) {
  return (
    <>
      <p className="arrival__eyebrow arrival-label">{CENTER_COPY.eyebrow}</p>
      <h1 id={id} className="arrival__question">
        {CENTER_COPY.mainQuestion}
      </h1>
    </>
  );
}
