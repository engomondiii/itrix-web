'use client';

import { useEffect, useState } from 'react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ConciergePanel } from '@/components/review/ConciergePanel';
import { PromptInput } from '@/components/review/PromptInput';
import { PressureSignalCards } from '@/components/review/PressureSignalCards';
import { PlatformEnvironmentSelector } from '@/components/review/PlatformEnvironmentSelector';
import { ReviewSubmitButton } from '@/components/review/ReviewSubmitButton';
import { ConfidentialityNote } from '@/components/center/ConfidentialityNote';
import { StageAwareHeading } from '@/components/shell/StageAwareHeading';
import { StateMorph } from '@/components/shell/StateMorph';
import { useReviewFlow } from '@/hooks/useReviewFlow';
import { useReviewStore } from '@/store/reviewStore';
import { REVIEW_COPY } from '@/lib/content/centerCopy';

/**
 * The review surface — States 2–3 (Surface 1 v4.0 §2.3, Playbook v1.5 §13).
 *
 *   THE NO-REPEAT CONTRACT
 *   The sentence typed on the approved center IS the first review turn. This
 *   page CONTINUES from it — it confirms what was captured, editable, and moves
 *   on. A second "describe your bottleneck" box anywhere in the flow is a defect.
 *
 * PHASE 2: the centre MORPHS between States 2 and 3 rather than navigating.
 * StateMorph preserves scroll and focus across the change and announces it, so a
 * visitor mid-sentence when their state advances keeps both their place and
 * their cursor (Architecture v2.5 §11.9).
 */
export default function ReviewIntakePage() {
  const { submitPrompt, submitting, promptError } = useReviewFlow();
  const prompt = useReviewStore((s) => s.prompt);
  const immediate = useReviewStore((s) => s.immediateResponse);

  const [hydrated, setHydrated] = useState<boolean>(
    () => useReviewStore.persist?.hasHydrated?.() ?? false,
  );
  useEffect(() => useReviewStore.persist?.onFinishHydration?.(() => setHydrated(true)), []);

  const hasCapturedSentence = hydrated && prompt.trim().length > 0;

  // State 2 is listening; State 3 is reflection. The arrival of an immediate
  // response is what moves the centre — no route change, no remount.
  const stateKey = immediate ? 'reflection' : 'listening';

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <StateMorph
        stateKey={stateKey}
        announcement={immediate ? 'Your reflection is ready below.' : undefined}
      >
        <ConciergePanel>
          <div className="flex flex-col gap-6">
            <StageAwareHeading
              as="h1"
              eyebrow={REVIEW_COPY.sectionTitle}
              support={hasCapturedSentence ? REVIEW_COPY.capturedIntro : undefined}
            >
              {hasCapturedSentence ? REVIEW_COPY.capturedLabel : REVIEW_COPY.coldStartQuestion}
            </StageAwareHeading>

            {/* One PromptInput, two meanings: the editable echo of what we heard,
                or — for a visitor who skipped the center — the first input. */}
            <PromptInput
              label={hasCapturedSentence ? REVIEW_COPY.addMore : REVIEW_COPY.coldStartLabel}
              error={promptError ?? undefined}
            />

            <PressureSignalCards />
            <PlatformEnvironmentSelector />

            <ConfidentialityNote variant="full" />

            {promptError ? <ErrorMessage>{promptError}</ErrorMessage> : null}

            <ReviewSubmitButton onClick={() => void submitPrompt()} loading={submitting} fullWidth>
              {REVIEW_COPY.continue}
            </ReviewSubmitButton>

            {hasCapturedSentence ? (
              <span className="sr-only" role="status">
                Your description carried over from the first screen. You can edit it here.
              </span>
            ) : null}
          </div>
        </ConciergePanel>
      </StateMorph>
    </div>
  );
}
