'use client';

import { SuccessPlanBoard } from '@/components/success/SuccessPlanBoard';
import { useSuccessPlan } from '@/hooks/useSuccessPlan';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';

/**
 * MEETINGS — past notes, and what is scheduled.
 *
 * It mounts the shared success plan, which is where the schedule and the agreed goals
 * actually live: the 30/60/90 board carries goals, owners on BOTH sides, dependencies
 * and dates. Splitting "meetings" from "the plan" would give a customer two places to
 * look for the same date.
 *
 * SCHEDULING IS NOT HERE. The scheduling card is one of the six rows v2.6 §11.6A
 * re-homed into the conversation, and v2.7 §2.7 forbids it in the pane. A customer
 * reads the schedule here and CHANGES it by talking to their named owner.
 */
export function MeetingsPaneSection() {
  const { data, loading } = useSuccessPlan();

  return (
    <PaneSectionFrame
      section="meetings"
      loading={loading}
      empty={!data}
      emptyMessage={PANE_SECTION_EMPTY.meetings}
    >
      <SuccessPlanBoard plan={data} />
    </PaneSectionFrame>
  );
}
