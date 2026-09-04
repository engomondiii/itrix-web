'use client';

import Link from 'next/link';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { EvalTracker } from '@/components/portal/EvalTracker';
import { useEvalTracking } from '@/hooks/useEvalTracking';
import { useLocaleStore } from '@/store/localeStore';

/** Customer-safe assessment deep link. Internal waiver/risk reasoning never crosses the client API. */
export default function AssessmentPage() {
  const ko = useLocaleStore((state) => state.locale) === 'ko';
  const { data, loading } = useEvalTracking();
  return (
    <>
      <PortalTopbar title="Assessment" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        <Link href="/workspace" className="artifact-page__back">{ko ? '대화로 돌아가기' : 'Back to your conversation'}</Link>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data?.exists ? (
          <EvalTracker evaluation={data} />
        ) : (
          <EmptyState>{ko ? '현재 진행 중인 평가가 없습니다.' : 'No assessment is underway yet.'}</EmptyState>
        )}
      </div>
    </>
  );
}
