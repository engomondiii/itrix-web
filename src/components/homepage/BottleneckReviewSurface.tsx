'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PromptInput } from '@/components/review/PromptInput';
import { PressureSignalCards } from '@/components/review/PressureSignalCards';
import { ReviewSubmitButton } from '@/components/review/ReviewSubmitButton';
import { ImmediateResponseArea } from './ImmediateResponseArea';
import { useReviewStore } from '@/store/reviewStore';
import { trackCTAClick } from '@/lib/analytics/trackCTAClick';
import { routes } from '@/constants/routes';

/** The interactive homepage entry into the Compute Bottleneck Review. */
export function BottleneckReviewSurface() {
  const router = useRouter();
  const setStep = useReviewStore((s) => s.setStep);
  const prompt = useReviewStore((s) => s.prompt);
  const pressures = useReviewStore((s) => s.selectedPressures);
  const canStart = prompt.trim().length > 0 || pressures.length > 0;

  function begin() {
    trackCTAClick({ label: 'Begin review', location: 'homepage_surface' });
    setStep('prompt');
    router.push(routes.review);
  }

  return (
    <section className="section border-b border-line bg-surface-warm">
      <div className="container-page grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Card variant="default" className="flex flex-col gap-6">
          <div>
            <SectionLabel>Compute bottleneck review</SectionLabel>
            <h2 className="mt-3 text-web-h2 text-indigo-950">Start with the workload. Get a structural read.</h2>
            <p className="reading mt-2">No quote, no sales call — a representation-level look at where the cost actually sits.</p>
          </div>
          <PromptInput />
          <PressureSignalCards />
          <ReviewSubmitButton onClick={begin} disabled={!canStart} fullWidth>
            Continue the review
          </ReviewSubmitButton>
        </Card>
        <div className="lg:pt-10">
          <ImmediateResponseArea />
        </div>
      </div>
    </section>
  );
}
