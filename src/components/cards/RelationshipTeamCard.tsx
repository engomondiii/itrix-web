'use client';

import { RelationshipTeamCard as TeamList } from '@/components/success/RelationshipTeamCard';
import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { InlineCard } from '@/types/artifact.types';
import type { RelationshipTeamMember } from '@/types/success.types';

/**
 * Reveal 5 — the named humans who own this relationship.
 *
 * It appends at the FIRST PAYMENT (State 7), not at license-out. A paid
 * Assessment customer already has named owners, support access and success
 * goals; making them wait for a signed licence would invert the customer-first
 * principle (Architecture v2.6 §7.1).
 *
 * THE ABSOLUTE this card exists to satisfy:
 *
 *   "A customer can always reach a named human without first negotiating with an
 *    agent. If a customer asks for a person, they get a person."
 *
 * The conversation header carries the standing one-action affordance; this card
 * is the introduction, with each person's role and what they handle. It reuses
 * the existing team list rather than duplicating it — v5.0 re-homes those
 * components into cards, it does not replace them.
 */
interface TeamPayload {
  team?: RelationshipTeamMember[];
}

export function RelationshipTeamCard({ card }: { card: InlineCard }) {
  const p = (card.payload ?? {}) as TeamPayload;
  const team = p.team ?? [];

  return (
    <aside className="inline-card inline-card--team" data-card={card.type}>
      <p className="inline-card__title">{card.title || SUCCESS_COPY.team.title}</p>
      <p className="inline-card__body">{card.body || SUCCESS_COPY.team.intro}</p>

      {team.length > 0 ? (
        <TeamList team={team} />
      ) : (
        <p className="inline-card__body">{SUCCESS_COPY.team.empty}</p>
      )}

      <p className="inline-card__reassurance">{SUCCESS_COPY.team.reachability}</p>
    </aside>
  );
}
