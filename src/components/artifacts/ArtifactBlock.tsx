'use client';

import { useId, useState } from 'react';
import { ArtifactHeader } from './ArtifactHeader';
import { ArtifactActions } from './ArtifactActions';
import { ReflectionArtifact } from './ReflectionArtifact';
import { PitchRoomArtifact } from './PitchRoomArtifact';
import { ReviewSummaryArtifact } from './ReviewSummaryArtifact';
import { BoundaryWasteMapArtifact } from './BoundaryWasteMapArtifact';
import { PoCEvidenceArtifact } from './PoCEvidenceArtifact';
import { IntegrationReadinessArtifact } from './IntegrationReadinessArtifact';
import { SuccessOverviewArtifact } from './SuccessOverviewArtifact';
import { DocumentArtifact } from './DocumentArtifact';
import { isRenderableArtifact } from '@/lib/journey/artifactTypes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { Artifact } from '@/types/artifact.types';

/**
 * A governed artifact, rendered INSIDE the transcript.
 *
 * The rules it enforces (Surface 1 v5.0 §3.9):
 *
 *   · An UNKNOWN type renders nothing and logs. It never falls back to a generic
 *     renderer — a generic renderer would display a payload nobody designed a
 *     disclosure review for.
 *   · It is COLLAPSED by default beyond the most recent one, and expanding is a
 *     logged visitor action ("pulled, not pushed").
 *   · An artifact under review or blocked does not render its payload. The
 *     frontend cannot display ungoverned content.
 *
 * PHASE 3 completes the set — every type in the vocabulary now has a renderer.
 * Expanded artifacts stay in the transcript. They are the visitor's record.
 */
export interface ArtifactBlockProps {
  artifact: Artifact;
  /** The most recent artifact opens expanded; earlier ones start collapsed. */
  defaultOpen?: boolean;
  /** Pinned artifacts render open and are not collapsible away by default. */
  pinned?: boolean;
}

export function ArtifactBlock({ artifact, defaultOpen = false, pinned = false }: ArtifactBlockProps) {
  const uid = useId();
  const regionId = `${uid}-artifact`;
  const [open, setOpen] = useState(defaultOpen || pinned);

  if (!isRenderableArtifact(artifact.type)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[artifact] Type "${artifact.type}" has no renderer in this build. The ` +
          'vocabulary has drifted from apps/journey/constants.py.',
      );
    }
    return null;
  }

  if (artifact.governanceStatus !== 'approved') {
    /* Under review or blocked: the payload is not displayable. The turn that
       accompanies it carries the approved wording. */
    return null;
  }

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      if (next) trackEvent('artifact.opened', { type: artifact.type });
      return next;
    });
  }

  return (
    <section className="artifact" data-type={artifact.type} data-pinned={pinned || undefined}>
      <ArtifactHeader artifact={artifact} open={open} onToggle={toggle} regionId={regionId} />

      <div id={regionId} role="region" hidden={!open}>
        {artifact.type === 'reflection' ? <ReflectionArtifact artifact={artifact} /> : null}
        {artifact.type === 'pitch_room' ? <PitchRoomArtifact artifact={artifact} /> : null}
        {artifact.type === 'review_summary' ? <ReviewSummaryArtifact artifact={artifact} /> : null}
        {artifact.type === 'boundary_waste_map' ? <BoundaryWasteMapArtifact artifact={artifact} /> : null}
        {artifact.type === 'poc_evidence' ? <PoCEvidenceArtifact artifact={artifact} /> : null}
        {artifact.type === 'integration_readiness' ? <IntegrationReadinessArtifact artifact={artifact} /> : null}
        {artifact.type === 'success_overview' ? <SuccessOverviewArtifact artifact={artifact} /> : null}
        {artifact.type === 'document' ? <DocumentArtifact artifact={artifact} /> : null}

        <ArtifactActions artifact={artifact} />
      </div>
    </section>
  );
}
