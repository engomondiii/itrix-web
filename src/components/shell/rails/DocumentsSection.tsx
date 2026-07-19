'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailText, RailEmpty } from './_primitives';

/**
 * Documents shared with the visitor, and which of them they have opened.
 *
 * Phase 2 renders the shell of this section; the document list arrives with the
 * portal data room in Phase 3. Until the backend supplies items it stays silent
 * rather than showing an empty heading.
 */
export function DocumentsSection({
  items = [],
}: RailSectionRenderProps & { items?: readonly { label: string; href: string }[] }) {
  if (items.length === 0) return <RailEmpty />;
  return (
    <RailPanel title="Documents">
      {items.map((d) => (
        <a key={d.href} href={d.href} className="text-caption text-ink-primary underline underline-offset-2">
          {d.label}
        </a>
      ))}
      <RailText>Shared under the terms of your agreement with itriX.</RailText>
    </RailPanel>
  );
}
