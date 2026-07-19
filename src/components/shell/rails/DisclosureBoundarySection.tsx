'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailText } from './_primitives';

/**
 * A plain line between what is open and what is confidential.
 *
 * Stating the boundary is itself reassurance: a visitor who can see where the
 * line sits is far more willing to walk up to it.
 */
export function DisclosureBoundarySection({
  now,
  afterNda,
}: RailSectionRenderProps & { now?: string; afterNda?: string }) {
  return (
    <RailPanel title="What we can discuss now">
      <RailText>{now ?? 'The business pressure, the workload family, the environment it runs in, and the outcome you want to improve.'}</RailText>
      <RailText>{afterNda ?? 'After an NDA: your actual workload structure, validation boundaries, and a scoped assessment.'}</RailText>
    </RailPanel>
  );
}
