'use client';

import Link from 'next/link';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { IntegrationReadinessArtifact } from '@/components/artifacts/IntegrationReadinessArtifact';
import { useIntegration } from '@/hooks/useIntegration';
import { WORKSPACE_COPY } from '@/lib/content/successCopy';
import type { Artifact } from '@/types/artifact.types';

/**
 * State 9 — integration and commercial decisions, as a DEEP-LINK VIEW.
 *
 * Same artifact component as the thread. Pricing, terms and exclusivity are
 * never rendered on this surface — they are not public, not agent-emittable, and
 * not part of the payload.
 */
export default function IntegrationPage() {
  const { data, loading } = useIntegration();

  const artifact: Artifact | null = data?.exists
    ? {
        id: 'integration-deeplink',
        threadId: '',
        type: 'integration_readiness',
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
      <PortalTopbar title="Integration" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        <Link href="/workspace" className="artifact-page__back">
          Back to your conversation
        </Link>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : artifact ? (
          <div className="artifact artifact--deeplink">
            <IntegrationReadinessArtifact artifact={artifact} />
          </div>
        ) : (
          <EmptyState>{WORKSPACE_COPY.integration.empty}</EmptyState>
        )}
      </div>
    </>
  );
}
