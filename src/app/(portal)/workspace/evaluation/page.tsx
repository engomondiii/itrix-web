'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { EvalTracker } from '@/components/portal/EvalTracker';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useEvalTracking } from '@/hooks/useEvalTracking';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** Evaluation stage tracking (§66). */
export default function EvaluationPage() {
  const { data, loading } = useEvalTracking();

  return (
    <>
      <PortalTopbar title="Evaluation" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data && data.exists ? (
          <EvalTracker evaluation={data} />
        ) : (
          <EmptyState>{PORTAL_COPY.evaluation.emptyState}</EmptyState>
        )}
      </div>
    </>
  );
}
