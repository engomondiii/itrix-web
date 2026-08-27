'use client';

import { ConciergePanel } from '@/components/review/ConciergePanel';
import { QualificationFlow } from '@/components/review/QualificationFlow';
import { useReviewStore } from '@/store/reviewStore';
import { LocaleToggle } from '@/components/review/LocaleToggle';
import { useLocaleStore } from '@/store/localeStore';
import { qualificationUi } from '@/lib/i18n/qualificationLocale';

/**
 * Qualification — the two-stage adaptive pain-gain conversation (State 2→3).
 *
 * Embedded in the same ConciergePanel so it reads as one continuous
 * conversation. One question per screen, "Not sure" everywhere, and no score or
 * tier is ever shown.
 *
 * v6.0 PHASE 2: StateMorph is REMOVED (Surface 1 v6.0 §05). The conversation column
 * no longer morphs between states — it ACCUMULATES, and the content pane carries the
 * state-specific reading surface. Scroll and focus preservation moved into
 * `Transcript`, `ScrollAnchor` and `useScrollMemory`, where the scrolling container
 * actually is.
 *
 * The one thing StateMorph did that mattered on THIS page is kept: advancing from
 * Stage 1 to Stage 2 is announced politely. Scroll preservation was never meaningful
 * here — this is a route, and a route mounts at the top — but silently becoming a
 * different set of questions is disorienting for a screen-reader user, and that is
 * worth six lines rather than a component.
 */
export default function QualifyPage() {
  const stage = useReviewStore((s) => s.stage);
  const locale = useLocaleStore((s) => s.locale);
  const copy = qualificationUi(locale);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex justify-end"><LocaleToggle /></div>
      <ConciergePanel>
        <QualificationFlow />
      </ConciergePanel>

      {/* Polite: it must not interrupt someone mid-sentence. */}
      <div role="status" aria-live="polite" className="sr-only">
        {stage === 'stage_2' ? copy.liveStage2 : ''}
      </div>
    </div>
  );
}
