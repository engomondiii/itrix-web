'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { PoCTracker } from '@/components/portal/PoCTracker';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { StateMorph } from '@/components/shell/StateMorph';
import { PoCEvidenceTable } from '@/components/workspace/PoCEvidenceTable';
import { usePoCTracking } from '@/hooks/usePoCTracking';
import { usePoCEvidence } from '@/hooks/usePoCEvidence';
import { useJourneyContext } from '@/context/JourneyContext';
import { WORKSPACE_COPY } from '@/lib/content/successCopy';

/**
 * State 8 — the PoC evidence workspace.
 *
 * Phase 3 promotes this from milestone tracking to the full evidence surface:
 * baseline, agreed KPIs, the criteria set BEFORE the run, and the observed
 * outcomes shown as pass, partial or negative.
 *
 * The milestone tracker stays above the evidence, because it answers "where are
 * we" and the evidence answers "what did we find" — and the second question only
 * makes sense once the first is settled.
 */
export default function PoCPage() {
  const { data: tracking, loading: trackingLoading } = usePoCTracking();
  const { data: evidence, loading: evidenceLoading } = usePoCEvidence();
  const { stateKey } = useJourneyContext();

  const loading = trackingLoading || evidenceLoading;
  const hasAnything = (tracking && tracking.exists) || (evidence && evidence.exists);

  return (
    <>
      <PortalTopbar title="Proof of concept" />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : hasAnything ? (
          <StateMorph stateKey={stateKey}>
            <div className="flex flex-col gap-10">
              <header>
                <h1 className="font-display text-web-h2 text-ink-primary">{WORKSPACE_COPY.poc.title}</h1>
                <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{WORKSPACE_COPY.poc.intro}</p>
              </header>

              {tracking && tracking.exists ? <PoCTracker poc={tracking} /> : null}

              {evidence && evidence.exists ? (
                <>
                  {evidence.workloadScope ? <Section title="Workload scope" body={evidence.workloadScope} /> : null}
                  {evidence.baselineSummary ? <Section title="Baseline" body={evidence.baselineSummary} /> : null}
                  {evidence.benchmarkProtocol ? (
                    <Section title="Benchmark protocol" body={evidence.benchmarkProtocol} />
                  ) : null}

                  <section className="flex flex-col gap-3">
                    <h2 className="font-display text-web-h3 text-ink-primary">Evidence</h2>
                    <PoCEvidenceTable kpis={evidence.kpis} />
                  </section>

                  {evidence.decisionSummary ? (
                    <Section title={WORKSPACE_COPY.poc.decisionTitle} body={evidence.decisionSummary} />
                  ) : null}
                </>
              ) : null}
            </div>
          </StateMorph>
        ) : (
          <EmptyState>{WORKSPACE_COPY.poc.empty}</EmptyState>
        )}
      </div>
    </>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-web-h3 text-ink-primary">{title}</h2>
      <p className="max-w-reading text-web-body leading-relaxed text-ink-secondary">{body}</p>
    </section>
  );
}
