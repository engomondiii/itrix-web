'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailEmpty, RailList } from './_primitives';

/**
 * "Open questions" — what is still unanswered, on EITHER side.
 *
 * Deliberately two-directional: showing what itriX still owes the visitor is
 * what makes this memory rather than a checklist aimed at them.
 */
export function OpenQuestionsSection({
  items = [],
}: RailSectionRenderProps & { items?: readonly string[] }) {
  if (items.length === 0) return <RailEmpty />;
  return (
    <RailPanel title="Open questions">
      <RailList items={items} />
    </RailPanel>
  );
}
