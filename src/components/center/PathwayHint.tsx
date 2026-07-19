import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * The soft pathway hint — the last element of the approved center (§2.1 #7).
 *
 *   You share · itriX reflects · You receive a tailored brief · You decide what
 *   happens next
 *
 * It tells the visitor what happens after they submit, so submitting does not
 * feel like a leap. It is deliberately calm: no arrow animation, no progress
 * bar, no urgency. The separators are decorative and hidden from assistive tech;
 * the steps themselves read as an ordered list.
 */
export function PathwayHint() {
  return (
    <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-caption text-ink-secondary" aria-label="What happens after you submit">
      {CENTER_COPY.pathwayHint.map((step, i) => (
        <li key={step} className="flex items-center gap-3">
          <span>{step}</span>
          {i < CENTER_COPY.pathwayHint.length - 1 ? (
            <span aria-hidden="true" className="h-px w-6 bg-accent-line" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
