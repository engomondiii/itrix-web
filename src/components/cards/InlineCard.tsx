'use client';

import Link from 'next/link';
import { DisclosureBoundaryCard } from './DisclosureBoundaryCard';
import { SpecialistCard } from './SpecialistCard';
import { SchedulingCard } from './SchedulingCard';
import { NdaChecklistCard } from './NdaChecklistCard';
import { AccountCreateCard } from './AccountCreateCard';
import { NextBestActionCard } from './NextBestActionCard';
import { RelationshipTeamCard } from './RelationshipTeamCard';
import { SupportCard } from './SupportCard';
import { SatisfactionPulseCard } from './SatisfactionPulseCard';
import { SuccessReviewCard } from './SuccessReviewCard';
import { isCardType } from '@/types/artifact.types';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { InlineCard as InlineCardData } from '@/types/artifact.types';

/**
 * A single governed step or notice, in the transcript.
 *
 * ONE ACTION PER CARD (Playbook v1.6 §16F). Never a list of offers, never a
 * countdown, never a "limited availability" line, never a price.
 *
 * THE FRONTEND DOES NOT DECIDE SUPPRESSION. The backend applies the value-first
 * gate and the customer-first precedence rule before the payload is built. A
 * commercial card that has been suppressed is simply absent — this component
 * never softens it, greys it out, or explains to the visitor that something was
 * withheld (Surface 1 v5.0 §7.3).
 *
 * PHASE 3 completes the vocabulary: the State 10 family now routes to its own
 * components. An unknown card type still renders nothing and logs.
 */
export function InlineCard({ card }: { card: InlineCardData }) {
  if (!isCardType(card.type)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[card] Unknown card type "${card.type}". Nothing was rendered.`);
    }
    return null;
  }

  /* The typed cards own their own body. */
  if (card.type === 'disclosure_boundary') return <DisclosureBoundaryCard card={card} />;
  if (card.type === 'specialist') return <SpecialistCard card={card} />;
  if (card.type === 'scheduling') return <SchedulingCard card={card} />;
  if (card.type === 'nda_checklist') return <NdaChecklistCard card={card} />;
  if (card.type === 'account_create') return <AccountCreateCard card={card} />;
  if (card.type === 'next_best_action') return <NextBestActionCard card={card} />;
  if (card.type === 'relationship_team') return <RelationshipTeamCard card={card} />;
  if (card.type === 'support') return <SupportCard card={card} />;
  if (card.type === 'satisfaction_pulse') return <SatisfactionPulseCard card={card} />;
  if (card.type === 'success_review') return <SuccessReviewCard card={card} />;

  return (
    <aside className="inline-card" data-card={card.type}>
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
