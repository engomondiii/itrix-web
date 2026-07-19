'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { Spinner } from '@/components/ui/Spinner';
import { SuccessPlanBoard } from '@/components/success/SuccessPlanBoard';
import { useSuccessPlan } from '@/hooks/useSuccessPlan';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/**
 * Meetings and the shared plan.
 *
 * The plan and the next review live together, because a review with no agenda is
 * a meeting nobody prepares for — the plan IS the agenda.
 */
export default function MeetingsPage() {
  const { data, loading } = useSuccessPlan();
  return (
    <>
      <PortalTopbar title="Meetings" />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-8">
        <header>
          <h1 className="font-display text-web-h2 text-ink-primary">{SUCCESS_COPY.meetings.title}</h1>
          <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{SUCCESS_COPY.meetings.intro}</p>
        </header>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <>
            {data?.nextReviewAt ? (
              <p className="rounded-lg border border-border-medium bg-soft px-4 py-3 text-web-body text-ink-primary">
                {SUCCESS_COPY.meetings.nextReview}: {new Date(data.nextReviewAt).toLocaleString()}
              </p>
            ) : (
              <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.meetings.empty}</p>
            )}
            <section aria-labelledby="plan-title" className="flex flex-col gap-3">
              <h2 id="plan-title" className="font-display text-web-h3 text-ink-primary">{SUCCESS_COPY.plan.title}</h2>
              <p className="max-w-reading text-caption text-ink-secondary">{SUCCESS_COPY.plan.intro}</p>
              <SuccessPlanBoard plan={data} />
            </section>
          </>
        )}
      </div>
    </>
  );
}
