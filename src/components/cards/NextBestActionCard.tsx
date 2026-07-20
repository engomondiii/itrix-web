'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { InlineCard } from '@/types/artifact.types';

/**
 * The single next step, in the thread.
 *
 * THE FRONTEND DOES NOT DECIDE SUPPRESSION, and this is the component where that
 * matters most. The customer-first precedence rule runs on the backend before
 * the payload is built (Architecture v2.6 §18.7):
 *
 *   1. blocking support issue open   -> support action is primary
 *   2. agreed outcome off plan       -> outcome action is primary
 *   3. adoption below plan           -> enablement action is primary
 *   4. negative trust signal         -> human outreach is primary
 *   5. otherwise, and only if expansion_allowed -> commercial action eligible
 *
 * A commercial card ranked primary while any of 1–4 hold is a DEFECT, not a
 * judgement call. By the time this component runs, that decision is already
 * made: a suppressed commercial action is simply absent from the payload.
 *
 * So there is no filtering here, no greying out, and no explanation to the
 * visitor that something was withheld — explaining it would leak the suppression
 * itself (Surface 1 v5.0 §7.3).
 *
 * ONE ACTION. Never a list of offers, never a countdown, never a price.
 */
export function NextBestActionCard({ card }: { card: InlineCard }) {
  return (
    <aside className="inline-card inline-card--nba" data-card={card.type}>
      <p className="inline-card__title">{card.title}</p>
      {card.body ? <p className="inline-card__body">{card.body}</p> : null}

      {card.action ? (
        card.action.href ? (
          <Link
            href={card.action.href}
            className="inline-card__action"
            onClick={() =>
              trackEvent('card.action_taken', {
                card: card.type,
                commercial: Boolean(card.action?.commercial),
              })
            }
          >
            {card.action.label}
          </Link>
        ) : (
          <p className="inline-card__action inline-card__action--static">{card.action.label}</p>
        )
      ) : null}
    </aside>
  );
}
