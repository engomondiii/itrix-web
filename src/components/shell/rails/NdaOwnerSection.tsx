'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailStrong, RailText, RailEmpty } from './_primitives';

/**
 * Who owns the NDA, what stage it is at, and what is needed from the visitor.
 *
 * All three, always. "In progress" with no owner and no ask is how a document
 * stalls for a fortnight.
 */
export function NdaOwnerSection({
  owner,
  status,
  actionRequired,
}: RailSectionRenderProps & {
  owner?: string;
  status?: string;
  actionRequired?: string;
}) {
  if (!owner && !status) return <RailEmpty />;
  return (
    <RailPanel title="NDA">
      {owner ? <RailStrong>{owner}</RailStrong> : null}
      {status ? <RailText>{status}</RailText> : null}
      {actionRequired ? <RailText>Needed from you: {actionRequired}</RailText> : null}
    </RailPanel>
  );
}
