'use client';

import { OutcomeProgressCard } from '@/components/success/OutcomeProgressCard';
import { useOutcomes } from '@/hooks/useOutcomes';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';

/**
 * OUTCOMES — progress against the outcomes the CUSTOMER agreed.
 *
 * Never an internal sales target, a pipeline stage or a commercial probability. The
 * `Outcome` type has nowhere to put one and the backend serializer strips them before
 * the payload leaves the server; mounting the shipped card keeps the pane inside that
 * guarantee rather than beside it.
 *
 * The status words are fixed at four — On plan · At risk · Off plan · Achieved
 * (Playbook v1.7 State 10). No fifth, softer word.
 */
export function OutcomesPaneSection() {
  const { outcomes, loading } = useOutcomes();

  return (
    <PaneSectionFrame
      section="outcomes"
      loading={loading}
      empty={outcomes.length === 0}
      emptyMessage={PANE_SECTION_EMPTY.outcomes}
    >
      <div className="pane__stack">
        {outcomes.map((o) => <OutcomeProgressCard key={o.id} outcome={o} />)}
      </div>
    </PaneSectionFrame>
  );
}
