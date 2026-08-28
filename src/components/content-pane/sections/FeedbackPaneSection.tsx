'use client';

import { ChangesSinceLastVisit } from '@/components/success/ChangesSinceLastVisit';
import { PANE_COPY, PANE_COPY_KO } from '@/lib/content/paneCopy';
import { useLocaleStore } from '@/store/localeStore';
import { PaneSectionFrame } from './_shared';

/**
 * FEEDBACK — "what you have told us, and what we did about it" (Playbook v1.7 §16E).
 *
 * ── WHY THERE IS NO PULSE AND NO COMPOSER IN HERE ───────────────────────────
 * This is the section most likely to be built wrongly, so the reasoning is worth
 * writing down.
 *
 * The obvious implementation mounts `SatisfactionPulse` and `ImprovementComposer` —
 * the two feedback components v5.0 shipped. Both are forbidden here:
 *
 *   · THE SATISFACTION PULSE is one of the six rows Architecture v2.6 §11.6A re-homed
 *     out of the retired right value rail, and v2.7 §2.7 restates that re-homing as a
 *     prohibition. It is an ASK, and asks live in the conversation.
 *   · THE IMPROVEMENT COMPOSER is a composer. This surface has exactly one composer,
 *     pinned beneath the transcript, and at State 10 it already routes improvement
 *     requests (`useComposer`, journeyState === 10). A second composer in a collapsible
 *     panel would be a second place to say something, one of which can be closed.
 *
 * ── AND WHY ONLY HALF OF THE SECTION'S PROMISE IS KEPT ──────────────────────
 * "What we did about it" is the change digest, and it renders. "What you have told us"
 * has NO READ ENDPOINT: the feedback endpoints are write-only by deliberate design in
 * v5.0 Phase 3 — a pulse cannot be read back — so that a customer's candid rating
 * cannot become something they are later shown, or shown to have said.
 *
 * That is a good decision, and this section does not work around it. It says plainly
 * that feedback is answered in the conversation instead of implying a record exists.
 */
export function FeedbackPaneSection() {
  const paneCopy = useLocaleStore((state) => state.locale) === 'ko' ? PANE_COPY_KO : PANE_COPY;
  return (
    <PaneSectionFrame section="feedback">
      <div className="pane__stack">
        <ChangesSinceLastVisit />
        <p className="pane__note">{paneCopy.feedbackNote}</p>
      </div>
    </PaneSectionFrame>
  );
}
