'use client';

import { BoundaryWasteMapArtifact } from '@/components/artifacts/BoundaryWasteMapArtifact';
import { useAssessment } from '@/hooks/useAssessment';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { ArtifactBackedSection } from './ArtifactBackedSection';
import type { Artifact } from '@/types/artifact.types';

/**
 * State 7 — the Alpha Compute Assessment.
 *
 * The thread's `boundary_waste_map` artifact is preferred. The workspace payload is
 * the fallback, for a customer who arrived through /workspace.
 *
 * ── THE ONE THING THAT MUST NOT DRIFT ───────────────────────────────────────
 * `BoundaryWasteMapArtifact` has NO NUMBER FIELDS AT ALL — that was a deliberate
 * structural decision in v5.0 Phase 3, so a performance claim cannot be made before a
 * PoC even by accident. Mounting the shipped component rather than re-rendering the
 * payload here is what keeps that guarantee; a bespoke renderer in the pane would be a
 * second place for a figure to appear.
 */
export function AssessmentPaneSection() {
  const { data, loading } = useAssessment();

  /* The hook returns a payload; the artifact component expects an envelope. Building
     it here keeps the component identical in the pane, the transcript and the
     deep-link view rather than giving it three shapes to understand. */
  const fallback: Artifact | null = data?.exists
    ? {
        id: 'assessment-pane',
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
    <ArtifactBackedSection
      section="workspace_assessment"
      types={['boundary_waste_map']}
      loading={loading}
      emptyMessage={PANE_SECTION_EMPTY.workspace_assessment}
      fallback={fallback ? <BoundaryWasteMapArtifact artifact={fallback} /> : undefined}
    />
  );
}
