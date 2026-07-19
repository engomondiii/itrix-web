'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailEmpty, RailList } from './_primitives';

/**
 * "Decisions" — what has been agreed, and when.
 *
 * A shared record, not a sales log. Everything here is something BOTH sides
 * decided; nothing here is an internal assessment of the visitor.
 */
export function DecisionsSection({
  items = [],
}: RailSectionRenderProps & { items?: readonly string[] }) {
  if (items.length === 0) return <RailEmpty />;
  return (
    <RailPanel title="Decisions">
      <RailList items={items} />
    </RailPanel>
  );
}
