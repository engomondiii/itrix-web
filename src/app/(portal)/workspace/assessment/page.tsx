'use client';

import Link from 'next/link';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { BoundaryWasteMapArtifact } from '@/components/artifacts/BoundaryWasteMapArtifact';
import { useAssessment } from '@/hooks/useAssessment';
import { useWorkspaceCopy } from '@/lib/i18n/successLocale';
import type { Artifact } from '@/types/artifact.types';
import { useLocaleStore } from '@/store/localeStore';

/**
 * State 7 — the assessment, as a DEEP-LINK VIEW.
 *
 * The assessment lives in the thread. This route is an alternative way to reach
 * it — for print, for sharing, for someone who bookmarked it — and it renders
 * the SAME artifact component the transcript renders, so the two can never drift
 * (Surface 1 v5.0 §1.2).
 *
 * THE WAY BACK IS NOT OPTIONAL. A deep link that leaves someone stranded turns
 * the artifact into the real interface while the conversation decays behind it.
 */
export default function AssessmentPage() {
  const ko = useLocaleStore((state) => state.locale) === 'ko';
  const workspaceCopy = useWorkspaceCopy();
  const { data, loading } = useAssessment();

  /* The hook returns the payload; the artifact wrapper expects an Artifact
     envelope. Building it here keeps the artifact component identical in both
     places rather than giving it two shapes to understand. */
  const artifact: Artifact | null = data?.exists
    ? {
        id: 'assessment-deeplink',
        threadId: '',
        type: 'boundary_waste_map',
        version: 1,
        payload: data as unknown as Record<string, unknown>,
        disclosureLevel: 'nda_only',
        governanceStatus: 'approved',
        seq: 0,
        createdAt: new Date().toISOString(),
      }
    : null;

  return (
    <>
      <PortalTopbar title="Assessment" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        <Link href="/workspace" className="artifact-page__back">
          {ko ? '대화로 돌아가기' : 'Back to your conversation'}
        </Link>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : artifact ? (
          <div className="artifact artifact--deeplink">
            <BoundaryWasteMapArtifact artifact={artifact} />
          </div>
        ) : (
          <EmptyState>{workspaceCopy.assessment.empty}</EmptyState>
        )}
      </div>
    </>
  );
}
