'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailText, RailStrong, RailEmpty } from './_primitives';

/**
 * The recommended path, with one line on WHY.
 *
 * The reason matters as much as the recommendation: a suggestion the visitor
 * cannot audit reads as a sales push, and this rail must never do that.
 */
export function RecommendedPathwaySection({
  label,
  reason,
}: RailSectionRenderProps & {
  label?: string;
  reason?: string;
}) {
  if (!label) return <RailEmpty />;
  return (
    <RailPanel title="Recommended">
      <RailStrong>{label}</RailStrong>
      {reason ? <RailText>{reason}</RailText> : null}
    </RailPanel>
  );
}
