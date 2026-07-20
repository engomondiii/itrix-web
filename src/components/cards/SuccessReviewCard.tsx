'use client';

import type { InlineCard } from '@/types/artifact.types';

/**
 * The next success review — when we next sit down together.
 *
 *   "Next review — when we next sit down together, and the agenda so far."
 *   (Playbook v1.6 §16F)
 *
 * The agenda is shown BEFORE the meeting, not sprung during it. A customer who
 * can see what will be discussed can prepare, disagree with the framing, or add
 * to it — which is the difference between a review and a presentation.
 *
 * It carries no commercial action. Expansion, if it is earned, arrives as its
 * own next-best-action card that the backend decides to send.
 */
interface ReviewPayload {
  scheduledFor?: string;
  withWhom?: string;
  agenda?: string[];
}

export function SuccessReviewCard({ card }: { card: InlineCard }) {
  const p = (card.payload ?? {}) as ReviewPayload;
  const agenda = p.agenda ?? [];

  return (
    <aside className="inline-card inline-card--review" data-card={card.type}>
      <p className="inline-card__title">{card.title}</p>

      {p.scheduledFor ? (
        <p className="inline-card__slot">
          {p.scheduledFor}
          {p.withWhom ? <span className="inline-card__slot-meta">with {p.withWhom}</span> : null}
        </p>
      ) : null}

      {card.body ? <p className="inline-card__body">{card.body}</p> : null}

      {agenda.length > 0 ? (
        <>
          <p className="inline-card__column-title">Agenda so far</p>
          <ul className="inline-card__saved">
            {agenda.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
    </aside>
  );
}
