'use client';

import { PoCEvidenceArtifact } from '@/components/artifacts/PoCEvidenceArtifact';
import { usePoCEvidence } from '@/hooks/usePoCEvidence';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { ArtifactBackedSection } from './ArtifactBackedSection';
import type { Artifact } from '@/types/artifact.types';

/**
 * State 8 — PoC evidence.
 *
 * ── A NEGATIVE RESULT IS REPORTED AS A NEGATIVE RESULT ──────────────────────
 * The payload is rendered exactly as produced. Nothing here may reclassify an
 * outcome, and `KpiOutcomeBadge` has only four values — pass, partial, negative,
 * pending — with no softening category such as "promising" (v5.0 Phase 3 decision,
 * Playbook v1.7 State 8).
 *
 * That is the single most load-bearing honesty rule on this surface: the credibility
 * of every claim itriX makes later rests on a negative PoC still reading as negative
 * a year afterwards. Mounting the shipped component is how the pane inherits it.
 */
export function PoCPaneSection() {
  const { data, loading } = usePoCEvidence();

  const fallback: Artifact | null = data
    ? {
        id: 'poc-pane',
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
    <ArtifactBackedSection
      section="workspace_poc"
      types={['poc_evidence']}
      loading={loading}
      emptyMessage={PANE_SECTION_EMPTY.workspace_poc}
      fallback={fallback ? <PoCEvidenceArtifact artifact={fallback} /> : undefined}
    />
  );
}
