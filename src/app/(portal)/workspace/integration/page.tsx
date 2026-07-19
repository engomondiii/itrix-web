'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { StateMorph } from '@/components/shell/StateMorph';
import { IntegrationReadiness } from '@/components/workspace/IntegrationReadiness';
import { CommercialDocumentList } from '@/components/workspace/CommercialDocumentList';
import { DecisionLog } from '@/components/workspace/DecisionLog';
import { useIntegration } from '@/hooks/useIntegration';
import { useJourneyContext } from '@/context/JourneyContext';
import { WORKSPACE_COPY } from '@/lib/content/successCopy';

/**
 * State 9 — integration and commercial decisions.
 *
 * Open decisions come before the log: the customer should meet what is waiting
 * on them before they meet the history of what is already settled.
 */
export default function IntegrationPage() {
  const { data, loading } = useIntegration();
  const { stateKey } = useJourneyContext();

  return (
    <>
      <PortalTopbar title="Integration" />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data && data.exists ? (
          <StateMorph stateKey={stateKey}>
            <div className="flex flex-col gap-10">
              <header>
                <h1 className="font-display text-web-h2 text-ink-primary">{WORKSPACE_COPY.integration.title}</h1>
                <p className="mt-3 max-w-reading text-web-body text-ink-secondary">
                  {WORKSPACE_COPY.integration.intro}
                </p>
              </header>

              <IntegrationReadiness items={data.readiness} />

              {data.acceptedEvidence.length > 0 ? (
                <section className="flex flex-col gap-2">
                  <h2 className="font-display text-web-h3 text-ink-primary">
                    {WORKSPACE_COPY.integration.evidenceTitle}
                  </h2>
                  <ul className="flex flex-col gap-1.5">
                    {data.acceptedEvidence.map((e) => (
                      <li key={e} className="text-web-body text-ink-secondary">{e}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <DecisionLog entries={data.openDecisions} title={WORKSPACE_COPY.integration.openDecisionsTitle} />
              <CommercialDocumentList documents={data.documents} />
              <DecisionLog entries={data.decisionLog} />
            </div>
          </StateMorph>
        ) : (
          <EmptyState>{WORKSPACE_COPY.integration.empty}</EmptyState>
        )}
      </div>
    </>
  );
}
