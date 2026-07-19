'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailText, RailEmpty } from './_primitives';

/**
 * The single next question (State 2), phrased as an invitation.
 *
 * ONE question. The right rail never becomes a form: the conversation asks one
 * thing at a time, mirrors, and continues (Playbook §03).
 */
export function NextQuestionSection({ question }: RailSectionRenderProps & { question?: string }) {
  if (!question) return <RailEmpty />;
  return (
    <RailPanel title="Next">
      <RailText>{question}</RailText>
    </RailPanel>
  );
}
