'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { SatisfactionPulse } from '@/components/success/SatisfactionPulse';
import { ImprovementComposer } from '@/components/success/ImprovementComposer';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/**
 * Private feedback.
 *
 * Two channels, deliberately separated: the pulse is how a customer tells us how
 * this is going, and the composer is how they ask for something. Merging them
 * would force a person with a concrete request to first rate us, which is a
 * toll nobody should pay to ask for help.
 */
export default function FeedbackPage() {
  return (
    <>
      <PortalTopbar title="Feedback" />
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-8">
        <section aria-labelledby="pulse-title" className="flex flex-col gap-3">
          <h1 id="pulse-title" className="font-display text-web-h2 text-ink-primary">
            {SUCCESS_COPY.feedback.title}
          </h1>
          <SatisfactionPulse />
        </section>

        <section aria-labelledby="improve-title" className="flex flex-col gap-3 rounded-panel border border-border-soft bg-surface-glass-soft p-5">
          <h2 id="improve-title" className="sr-only">Tell us what to improve</h2>
          <ImprovementComposer />
        </section>
      </div>
    </>
  );
}
