'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailEmpty, RailList } from './_primitives';

/** Notes from conversations already held, so nobody has to re-explain themselves. */
export function MeetingNotesSection({
  items = [],
}: RailSectionRenderProps & { items?: readonly string[] }) {
  if (items.length === 0) return <RailEmpty />;
  return (
    <RailPanel title="Meeting notes">
      <RailList items={items} />
    </RailPanel>
  );
}
