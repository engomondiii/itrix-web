import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * THE MAIN QUESTION — the single most important sentence on the platform.
 *
 *   "What would you like computation to do better?"
 *
 * It invites a problem; it does not announce a product. It is rendered from
 * CENTER_COPY so there is exactly one place in the codebase where it exists, and
 * changing it is a deliberate, reviewable act.
 *
 * `id` is exposed so the composer can point aria-labelledby at it — the question
 * IS the label for the prompt box, which is why the textarea's own label is
 * visually hidden rather than duplicated on screen.
 *
 * PHASE 2 CORRECTION: it is no longer the document's h1. The situation framing
 * takes the heading, per the approved package. This renders as a prominent
 * paragraph beneath it — larger than body copy, smaller than the framing line.
 */
export function MainQuestion({ id = 'main-question' }: { id?: string }) {
  return (
    <p id={id} className="arrival__question">
      {CENTER_COPY.mainQuestion}
    </p>
  );
}
