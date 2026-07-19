'use client';

import { ConciergePanel } from '@/components/review/ConciergePanel';
import { QualificationFlow } from '@/components/review/QualificationFlow';
import { StateMorph } from '@/components/shell/StateMorph';
import { useReviewStore } from '@/store/reviewStore';

/**
 * Qualification — the two-stage adaptive pain-gain conversation (State 2→3).
 *
 * Embedded in the same ConciergePanel so it reads as one continuous
 * conversation. One question per screen, "Not sure" everywhere, and no score or
 * tier is ever shown.
 *
 * PHASE 2: wrapped in StateMorph so advancing from Stage 1 to Stage 2 preserves
 * scroll and focus and is announced. The stage is the morph key — moving between
 * questions inside a stage is not a state change and must not disturb the page.
 */
export default function QualifyPage() {
  const stage = useReviewStore((s) => s.stage);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <StateMorph
        stateKey={`qualify-${stage}`}
        announcement={stage === 'stage_2' ? 'A few more questions, now that you have asked for more.' : undefined}
      >
        <ConciergePanel>
          <QualificationFlow />
        </ConciergePanel>
      </StateMorph>
    </div>
  );
}
