'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailStrong, RailText, RailEmpty } from './_primitives';

/**
 * A NAMED person, their role, and what they can help with.
 *
 * Only rendered once the relationship has earned it — the backend does not
 * authorize this section for an anonymous visitor, because naming a specialist
 * to someone who has not identified themselves is a sales move, not a service.
 */
export function SpecialistSection({
  name,
  role,
  helpsWith,
}: RailSectionRenderProps & {
  name?: string;
  role?: string;
  helpsWith?: string;
}) {
  if (!name) return <RailEmpty />;
  return (
    <RailPanel title="Your specialist">
      <RailStrong>{name}</RailStrong>
      {role ? <RailText>{role}</RailText> : null}
      {helpsWith ? <RailText>{helpsWith}</RailText> : null}
    </RailPanel>
  );
}
