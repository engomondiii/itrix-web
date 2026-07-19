'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { StateMorph } from '@/components/shell/StateMorph';
import { AssessmentWorkspace } from '@/components/workspace/AssessmentWorkspace';
import { useAssessment } from '@/hooks/useAssessment';
import { useJourneyContext } from '@/context/JourneyContext';
import { WORKSPACE_COPY } from '@/lib/content/successCopy';

/** State 7 — the Alpha Compute Assessment workspace. */
export default function AssessmentPage() {
  const { data, loading } = useAssessment();
  const { stateKey } = useJourneyContext();

  return (
    <>
      <PortalTopbar title="Assessment" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data && data.exists ? (
          <StateMorph stateKey={stateKey}>
            <AssessmentWorkspace data={data} />
          </StateMorph>
        ) : (
          <EmptyState>{WORKSPACE_COPY.assessment.empty}</EmptyState>
        )}
      </div>
    </>
  );
}
