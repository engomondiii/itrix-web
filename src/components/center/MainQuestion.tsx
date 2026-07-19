import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * THE MAIN QUESTION — the single most important sentence on the platform.
 *
 *   "What would you like computation to do better?"
 *
 * It invites a problem; it does not announce a product. It is rendered from
 * CENTER_COPY so there is exactly one place in the codebase where it exists,
 * and changing it is a deliberate, reviewable act.
 *
 * `id` is exposed so the composer can point aria-labelledby at it — the question
 * IS the label for the prompt box, which is why the textarea's own label is
 * visually hidden rather than duplicated on screen.
 */
export function MainQuestion({ id = 'main-question' }: { id?: string }) {
  return (
    <>
      <p id={id} className="mt-5 font-display text-web-question text-ink-primary">
        {CENTER_COPY.mainQuestion}
      </p>
      <p className="mt-3 max-w-reading text-web-body text-ink-secondary">
        {CENTER_COPY.supportingLine}
      </p>
    </>
  );
}
