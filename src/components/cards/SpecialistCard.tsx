'use client';

import type { InlineCard } from '@/types/artifact.types';

/**
 * A named human, introduced in the conversation.
 *
 * This is one half of R30 — a customer can always reach a named human without
 * first negotiating with an agent. The conversation header carries the standing
 * affordance; this card is the introduction at the moment an owner is assigned
 * (Architecture v2.6 §11.6A).
 *
 * A NAME AND A ROLE, and what they can help with. Never a photo, never a
 * "book a demo", never a sales title dressed up as support.
 */
interface SpecialistPayload {
  name?: string;
  role?: string;
  helpsWith?: string;
}

export function SpecialistCard({ card }: { card: InlineCard }) {
  const p = (card.payload ?? {}) as SpecialistPayload;

  return (
    <aside className="inline-card inline-card--specialist" data-card={card.type}>
      <p className="inline-card__title">{card.title}</p>
      {p.name ? (
        <p className="inline-card__person">
          <span className="inline-card__person-name">{p.name}</span>
          {p.role ? <span className="inline-card__person-role">{p.role}</span> : null}
        </p>
      ) : null}
      {p.helpsWith ? <p className="inline-card__body">{p.helpsWith}</p> : null}
      {card.body ? <p className="inline-card__body">{card.body}</p> : null}
    </aside>
  );
}
