'use client';

import { ConciergePanel } from '@/components/review/ConciergePanel';
import { QualificationFlow } from '@/components/review/QualificationFlow';

/**
 * Qualification — the two-stage adaptive pain-gain conversation, embedded in the same
 * ConciergePanel so it reads as one continuous conversation. One question per screen;
 * "Not sure" everywhere; no score or tier is ever shown.
 */
export default function QualifyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <ConciergePanel>
        <QualificationFlow />
      </ConciergePanel>
    </div>
  );
}
