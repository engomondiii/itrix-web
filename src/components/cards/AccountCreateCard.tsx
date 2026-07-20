'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { InlineCard } from '@/types/artifact.types';

/**
 * Reveal 2 — "Create your workspace" (Playbook v1.6 §16F, State 5).
 *
 *   "Keep this conversation, your brief and your documents in one place."
 *
 * TWO THINGS THIS CARD MUST GET RIGHT:
 *
 *   · It appears only for invite-token holders. The backend decides that; this
 *     component renders whatever it was given and never self-reveals.
 *   · It EXPLAINS WHAT IS SAVED at the point of creation, including what happens
 *     to the conversation and its attachments when the anonymous thread is
 *     claimed (Surface 1 v5.0 §7.5). Someone creating an account should not
 *     discover afterwards what came with them.
 */
interface AccountPayload {
  whatIsSaved?: string[];
}

export function AccountCreateCard({ card }: { card: InlineCard }) {
  const p = (card.payload ?? {}) as AccountPayload;

  return (
    <aside className="inline-card inline-card--account" data-card={card.type}>
      <p className="inline-card__title">{card.title}</p>
      {card.body ? <p className="inline-card__body">{card.body}</p> : null}

      {p.whatIsSaved && p.whatIsSaved.length > 0 ? (
        <>
          <p className="inline-card__column-title">What comes with you</p>
          <ul className="inline-card__saved">
            {p.whatIsSaved.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </>
      ) : null}

      {card.action?.href ? (
        <Link
          href={card.action.href}
          className="inline-card__action"
          onClick={() => trackEvent('account.invite_intent', { fromCard: true })}
        >
          {card.action.label}
        </Link>
      ) : null}
    </aside>
  );
}
