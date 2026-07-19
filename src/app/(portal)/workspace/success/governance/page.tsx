'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { Spinner } from '@/components/ui/Spinner';
import { DecisionLog } from '@/components/workspace/DecisionLog';
import { useIntegration } from '@/hooks/useIntegration';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/** The shared decision log — what was decided, by whom, and what awaits the customer. */
export default function GovernancePage() {
  const { data, loading } = useIntegration();
  const entries = data?.decisionLog ?? [];

  return (
    <>
      <PortalTopbar title="Decisions" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        <header>
          <h1 className="font-display text-web-h2 text-ink-primary">{SUCCESS_COPY.governance.title}</h1>
          <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{SUCCESS_COPY.governance.intro}</p>
        </header>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : entries.length > 0 ? (
          <DecisionLog entries={entries} title="" />
        ) : (
          <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.governance.empty}</p>
        )}
      </div>
    </>
  );
}
