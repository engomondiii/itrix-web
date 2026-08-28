'use client';

import type { InlineCard } from '@/types/artifact.types';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * "What we can discuss now, and what requires further authorization".
 *
 * It fires when the ceiling CHANGES, so the visitor always knows where the line
 * currently sits. The framing is reassurance, not friction:
 *
 *   "Protection is here to make a real conversation possible, not to slow it
 *    down."
 *
 * It never lists what is behind the line in enough detail to be the disclosure
 * itself — that would defeat the boundary it exists to explain.
 */
interface BoundaryPayload {
  openNow?: string[];
  afterNda?: string[];
  reassurance?: string;
}

export function DisclosureBoundaryCard({ card }: { card: InlineCard }) {
  const copy = useCommonCopy();
  const p = (card.payload ?? {}) as BoundaryPayload;

  return (
    <aside className="inline-card inline-card--boundary" data-card={card.type}>
      <p className="inline-card__title">{card.title}</p>
      {card.body ? <p className="inline-card__body">{card.body}</p> : null}

      <div className="inline-card__columns">
        {p.openNow && p.openNow.length > 0 ? (
          <div>
            <p className="inline-card__column-title">{copy.openNow}</p>
            <ul>{p.openNow.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ) : null}
        {p.afterNda && p.afterNda.length > 0 ? (
          <div>
            <p className="inline-card__column-title">{copy.agreementAuthorization}</p>
            <ul>{p.afterNda.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ) : null}
      </div>

      {p.reassurance ? <p className="inline-card__reassurance">{p.reassurance}</p> : null}
    </aside>
  );
}
