'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PromptInput } from '@/components/review/PromptInput';
import { PressureSignalCards } from '@/components/review/PressureSignalCards';
import { PlatformEnvironmentSelector } from '@/components/review/PlatformEnvironmentSelector';
import { ImmediateResponseArea } from '@/components/homepage/ImmediateResponseArea';
import { ReviewSubmitButton } from '@/components/review/ReviewSubmitButton';
import { useReviewFlow } from '@/hooks/useReviewFlow';
import { useImmediateResponse } from '@/hooks/useImmediateResponse';

export default function ReviewIntakePage() {
  const { submitPrompt, submitting, promptError } = useReviewFlow();
  const { hasInput } = useImmediateResponse();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <SectionLabel>Step 1 · The workload</SectionLabel>
        <h1 className="mt-3 text-web-h1 text-indigo-950">Tell us where it’s getting expensive.</h1>
        <p className="reading mt-3">Describe the workload and flag the pressures. We read the structure behind it — no quote, no sales call.</p>
      </header>

      {/* Side-by-side, mirroring the homepage BottleneckReviewSurface:
          left = the input surface, right = the live structural read. */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        {/* Left — input surface */}
        <Card variant="default" className="flex flex-col gap-6">
          <PromptInput error={promptError ?? undefined} />
          <PressureSignalCards />
          <PlatformEnvironmentSelector />

          {promptError ? <ErrorMessage>{promptError}</ErrorMessage> : null}

          <div className="border-t border-line-subtle pt-6">
            <ReviewSubmitButton onClick={() => void submitPrompt()} loading={submitting} fullWidth>
              Continue to qualification
            </ReviewSubmitButton>
          </div>
        </Card>

        {/* Right — live read (sticks in view as the left column grows).
            ImmediateResponseArea already renders the NDA banner once input
            exists, so we don't render a second standalone one here. */}
        <aside className="lg:sticky lg:top-6">
          {hasInput ? (
            <ImmediateResponseArea />
          ) : (
            <Card variant="warm" className="flex flex-col gap-2">
              <span className="text-micro font-semibold uppercase tracking-[0.1em] text-sapphire-600">Immediate read</span>
              <p className="reading text-ink-500">
                As you describe the workload and flag pressures, a structural read appears here in real time — the same instant feedback from the home page.
              </p>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}