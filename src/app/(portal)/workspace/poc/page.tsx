'use client';

import Link from 'next/link';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { PoCEvidenceArtifact } from '@/components/artifacts/PoCEvidenceArtifact';
import { usePoCEvidence } from '@/hooks/usePoCEvidence';
import { useWorkspaceCopy } from '@/lib/i18n/successLocale';
import type { Artifact } from '@/types/artifact.types';
import { useLocaleStore } from '@/store/localeStore';

/**
 * State 8 — PoC evidence, as a DEEP-LINK VIEW.
 *
 * It renders the same artifact component the transcript renders, so a result
 * cannot be worded one way in the thread and another way here. That matters more
 * for this artifact than any other: a PoC outcome is pass, partial, negative or
 * pending, and it is never re-described after the fact.
 */
export default function PoCPage() {
  const ko = useLocaleStore((state) => state.locale) === 'ko';
  const workspaceCopy = useWorkspaceCopy();
  const { data, loading } = usePoCEvidence();

  const artifact: Artifact | null = data?.exists
    ? {
        id: 'poc-deeplink',
        threadId: '',
        type: 'poc_evidence',
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
      <PortalTopbar title="Proof of concept" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        <Link href="/workspace" className="artifact-page__back">
          {ko ? '대화로 돌아가기' : 'Back to your conversation'}
        </Link>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : artifact ? (
          <div className="artifact artifact--deeplink">
            <PoCEvidenceArtifact artifact={artifact} />
          </div>
        ) : (
          <EmptyState>{workspaceCopy.poc.empty}</EmptyState>
        )}
      </div>
    </>
  );
}
