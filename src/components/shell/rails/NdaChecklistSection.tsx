'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailText, RailEmpty } from './_primitives';

export interface NdaChecklistItem {
  label: string;
  done: boolean;
}

/**
 * The NDA checklist (State 6) — what is done and what is outstanding.
 *
 * Status is never carried by colour alone: each row states "Done" or "Waiting"
 * in words as well as marking it (Surface 1 v4.0 §7.4).
 */
export function NdaChecklistSection({
  items = [],
}: RailSectionRenderProps & { items?: readonly NdaChecklistItem[] }) {
  if (items.length === 0) return <RailEmpty />;
  return (
    <RailPanel title="NDA checklist">
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-2 text-caption text-ink-secondary">
            <span aria-hidden="true" className="mt-[3px] text-ink-muted">
              {item.done ? '✓' : '·'}
            </span>
            <span>
              {item.label}
              <span className="sr-only">{item.done ? ' — done' : ' — waiting'}</span>
            </span>
          </li>
        ))}
      </ul>
      <RailText>Protection is here to make a real conversation possible.</RailText>
    </RailPanel>
  );
}
