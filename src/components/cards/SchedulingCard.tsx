'use client';

import Link from 'next/link';
import type { InlineCard } from '@/types/artifact.types';

/**
 * "Schedule" (Playbook v1.6 §16F).
 *
 *   "The next available time, not a form."
 *
 * That line is the whole design brief. A visitor who has already described their
 * bottleneck should not be asked to fill in their name and company again to get
 * twenty minutes — so this card offers a TIME, and the single action confirms it.
 */
interface SchedulingPayload {
  nextAvailable?: string;
  duration?: string;
  withWhom?: string;
}

export function SchedulingCard({ card }: { card: InlineCard }) {
  const p = (card.payload ?? {}) as SchedulingPayload;

  return (
    <aside className="inline-card inline-card--scheduling" data-card={card.type}>
      <p className="inline-card__title">{card.title}</p>

      {p.nextAvailable ? (
        <p className="inline-card__slot">
          {p.nextAvailable}
          {p.duration ? <span className="inline-card__slot-meta">{p.duration}</span> : null}
          {p.withWhom ? <span className="inline-card__slot-meta">with {p.withWhom}</span> : null}
        </p>
      ) : null}

      {card.body ? <p className="inline-card__body">{card.body}</p> : null}

      {card.action?.href ? (
        <Link href={card.action.href} className="inline-card__action">
          {card.action.label}
        </Link>
      ) : null}
    </aside>
  );
}
