import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * The soft pathway hint — THE LAST ELEMENT ON THE LANDING ROUTE (§2.1 #7, R29).
 *
 *   You share · itriX reflects · You receive a tailored brief · You decide what
 *   happens next
 *
 * It tells the visitor what happens after they submit, so submitting does not
 * feel like a leap. It is deliberately calm: no arrow animation, no progress
 * bar, no urgency. The separators are decorative and hidden from assistive tech;
 * the steps themselves read as an ordered list.
 *
 * Nothing renders after this on `/`. The minimal-landing e2e test asserts it.
 */
export function PathwayHint() {
  return (
    <ol className="arrival__pathway" aria-label="What happens after you submit">
      {CENTER_COPY.pathwayHint.map((step, i) => (
        <li key={step}>
          <span>{step}</span>
          {i < CENTER_COPY.pathwayHint.length - 1 ? (
            <span aria-hidden="true" className="arrival__pathway-rule" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
