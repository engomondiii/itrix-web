'use client';

import type { InlineCard } from '@/types/artifact.types';

/**
 * "NDA — who owns it, what stage it is at, what is needed from you."
 *
 * The status vocabulary is closed and honest: `done` / `waiting_on_us` /
 * `waiting_on_you`. There is no "in progress" that could mean either — a
 * customer looking at this card must be able to tell in one glance whether the
 * ball is in their court.
 *
 * Status is text plus icon, never colour alone.
 */
type ItemStatus = 'done' | 'waiting_on_us' | 'waiting_on_you';

interface ChecklistItem {
  label: string;
  status: ItemStatus;
}

interface NdaPayload {
  owner?: string;
  items?: ChecklistItem[];
}

const STATUS_LABEL: Record<ItemStatus, string> = {
  done: 'Done',
  waiting_on_us: 'With us',
  waiting_on_you: 'Needs you',
};

export function NdaChecklistCard({ card }: { card: InlineCard }) {
  const p = (card.payload ?? {}) as NdaPayload;
  const items = p.items ?? [];

  return (
    <aside className="inline-card inline-card--nda" data-card={card.type}>
      <p className="inline-card__title">{card.title}</p>
      {p.owner ? <p className="inline-card__body">Owned by {p.owner}.</p> : null}
      {card.body ? <p className="inline-card__body">{card.body}</p> : null}

      {items.length > 0 ? (
        <ul className="inline-card__checklist">
          {items.map((item) => (
            <li key={item.label} data-status={item.status}>
              <span className="inline-card__checklist-status">{STATUS_LABEL[item.status]}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
