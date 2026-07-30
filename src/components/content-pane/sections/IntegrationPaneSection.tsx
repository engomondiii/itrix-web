'use client';

import { IntegrationReadinessArtifact } from '@/components/artifacts/IntegrationReadinessArtifact';
import { useIntegration } from '@/hooks/useIntegration';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { ArtifactBackedSection } from './ArtifactBackedSection';
import type { Artifact } from '@/types/artifact.types';

/** State 9 — integration readiness, and the accepted evidence behind it. */
export function IntegrationPaneSection() {
  const { data, loading } = useIntegration();

  const fallback: Artifact | null = data
    ? {
        id: 'integration-pane',
        threadId: '',
        type: 'integration_readiness',
        version: 1,
        payload: data as unknown as Record<string, unknown>,
        disclosureLevel: 'customer_contract',
        governanceStatus: 'approved',
        seq: 0,
        createdAt: new Date().toISOString(),
      }
    : null;

  return (
    <ArtifactBackedSection
      section="workspace_integration"
      types={['integration_readiness']}
      loading={loading}
      emptyMessage={PANE_SECTION_EMPTY.workspace_integration}
      fallback={fallback ? <IntegrationReadinessArtifact artifact={fallback} /> : undefined}
    />
  );
}
