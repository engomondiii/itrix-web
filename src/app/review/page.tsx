'use client';

import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ConciergePanel } from '@/components/review/ConciergePanel';
import { PromptInput } from '@/components/review/PromptInput';
import { PressureSignalCards } from '@/components/review/PressureSignalCards';
import { PlatformEnvironmentSelector } from '@/components/review/PlatformEnvironmentSelector';
import { ReviewSubmitButton } from '@/components/review/ReviewSubmitButton';
import { useReviewFlow } from '@/hooks/useReviewFlow';

/**
 * Review intake — now an embedded conversation. The ConciergePanel shows the calm
 * opening + acknowledgement (§24); inside it, the visitor describes the workload,
 * flags pressures, and continues into the two-stage questions. No floating chat
 * bubble; the assistant lives only here.
 */
export default function ReviewIntakePage() {
  const { submitPrompt, submitting, promptError } = useReviewFlow();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <ConciergePanel>
        <div className="flex flex-col gap-6">
          <PromptInput error={promptError ?? undefined} />
          <PressureSignalCards />
          <PlatformEnvironmentSelector />

          {promptError ? <ErrorMessage>{promptError}</ErrorMessage> : null}

          <ReviewSubmitButton onClick={() => void submitPrompt()} loading={submitting} fullWidth>
            Continue
          </ReviewSubmitButton>
        </div>
      </ConciergePanel>
    </div>
  );
}
