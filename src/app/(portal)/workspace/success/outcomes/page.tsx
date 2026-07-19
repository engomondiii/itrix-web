'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { Spinner } from '@/components/ui/Spinner';
import { OutcomeProgressCard } from '@/components/success/OutcomeProgressCard';
import { useOutcomes } from '@/hooks/useOutcomes';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/** Progress against the agreed CUSTOMER outcomes — never an internal target. */
export default function OutcomesPage() {
  const { outcomes, loading } = useOutcomes();
  return (
    <>
      <PortalTopbar title="Outcomes" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        <header>
          <h1 className="font-display text-web-h2 text-ink-primary">{SUCCESS_COPY.outcomes.title}</h1>
          <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{SUCCESS_COPY.outcomes.intro}</p>
        </header>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : outcomes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {outcomes.map((o) => <OutcomeProgressCard key={o.id} outcome={o} />)}
          </div>
        ) : (
          <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.outcomes.empty}</p>
        )}
      </div>
    </>
  );
}
