'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailText, RailEmpty } from './_primitives';

/** The next available time — an offer, not a form. */
export function SchedulingSection({
  nextSlot,
  href,
}: RailSectionRenderProps & { nextSlot?: string; href?: string }) {
  if (!nextSlot && !href) return <RailEmpty />;
  return (
    <RailPanel title="Schedule">
      {nextSlot ? <RailText>{nextSlot}</RailText> : null}
      {href ? (
        <a href={href} className="text-caption text-ink-primary underline underline-offset-2">
          Find a time
        </a>
      ) : null}
    </RailPanel>
  );
}
