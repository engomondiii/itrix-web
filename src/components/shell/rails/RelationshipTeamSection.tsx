'use client';

import { RailPanel, RailStrong, RailText, RailEmpty } from './_primitives';
import { useSuccessOverview } from '@/hooks/useSuccessOverview';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/**
 * The named relationship team, in the rail.
 *
 * This is the section that makes the customer-first promise visible from
 * anywhere in the workspace: a customer should never have to navigate to find
 * out who to ask.
 */
export function RelationshipTeamSection() {
  const { data } = useSuccessOverview();
  const team = data?.team ?? [];
  if (team.length === 0) return <RailEmpty />;

  const primary = team.find((m) => m.isPrimary) ?? team[0];

  return (
    <RailPanel title={SUCCESS_COPY.team.title}>
      <RailStrong>{primary.name}</RailStrong>
      <RailText>{SUCCESS_COPY.team.roleLabel[primary.role]}</RailText>
      <RailText>{primary.expectations || SUCCESS_COPY.team.roles[primary.role]}</RailText>
      {team.length > 1 ? (
        <a href="/workspace/success" className="text-caption text-ink-primary underline underline-offset-2">
          See your whole team
        </a>
      ) : null}
    </RailPanel>
  );
}
