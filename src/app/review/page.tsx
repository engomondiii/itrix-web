'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PromptInput } from '@/components/review/PromptInput';
import { PressureSignalCards } from '@/components/review/PressureSignalCards';
import { PlatformEnvironmentSelector } from '@/components/review/PlatformEnvironmentSelector';
import { ImmediateResponseArea } from '@/components/homepage/ImmediateResponseArea';
import { NDAWarningBanner } from '@/components/review/NDAWarningBanner';
import { ReviewSubmitButton } from '@/components/review/ReviewSubmitButton';
import { useReviewFlow } from '@/hooks/useReviewFlow';

export default function ReviewIntakePage() {
  const { submitPrompt, submitting, promptError } = useReviewFlow();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <SectionLabel>Step 1 · The workload</SectionLabel>
        <h1 className="mt-3 text-web-h1 text-indigo-950">Tell us where it’s getting expensive.</h1>
        <p className="reading mt-3">Describe the workload and flag the pressures. We read the structure behind it — no quote, no sales call.</p>
      </header>

      <PromptInput error={promptError ?? undefined} />
      <PressureSignalCards />
      <PlatformEnvironmentSelector />
      <NDAWarningBanner />
      <ImmediateResponseArea />

      {promptError ? <ErrorMessage>{promptError}</ErrorMessage> : null}

      <div className="border-t border-line-subtle pt-6">
        <ReviewSubmitButton onClick={() => void submitPrompt()} loading={submitting} fullWidth>
          Continue to qualification
        </ReviewSubmitButton>
      </div>
    </div>
  );
}
