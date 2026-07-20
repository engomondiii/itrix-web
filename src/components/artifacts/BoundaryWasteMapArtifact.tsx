'use client';

import { BoundaryWasteMapView } from '@/components/workspace/BoundaryWasteMapView';
import type { Artifact } from '@/types/artifact.types';
import type { BoundaryWasteSection } from '@/types/workspace.types';

/**
 * State 7 — the Alpha Compute Assessment (Playbook v1.6, State 7).
 *
 *   "This holds the whole assessment: what we took in, the baseline we agreed,
 *    the Boundary Waste Map of your workload, technical feasibility, the
 *    benchmark we would design, and what we would recommend proving next."
 *
 * NO NUMERIC FIELDS — STRUCTURALLY, NOT BY CONVENTION.
 *
 * `BoundaryWasteSection` has no numeric member, so a performance claim before a
 * PoC is impossible to render rather than merely discouraged. That was a
 * deliberate structural decision in v4.0 Phase 3 and Phase 3 of v5.0 preserves
 * it: the assessment describes WHERE waste sits, never HOW MUCH is recoverable.
 * The number arrives with PoC evidence or not at all.
 *
 * The ten sections themselves are unchanged — this wrapper only re-homes the
 * existing view from a page section into an in-thread artifact.
 */
interface BoundaryWasteMapPayload {
  intro?: string;
  sections?: BoundaryWasteSection[];
  standingLine?: string;
}

export function BoundaryWasteMapArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as BoundaryWasteMapPayload;
  const sections = p.sections ?? [];

  return (
    <div className="artifact__body">
      {p.intro ? <p className="artifact__lead">{p.intro}</p> : null}

      {sections.length > 0 ? (
        <BoundaryWasteMapView sections={sections} />
      ) : (
        <p className="artifact__pending">
          The assessment is being prepared. Nothing is hidden from you — there is
          simply nothing to show yet.
        </p>
      )}

      {p.standingLine ? <p className="artifact__standing">{p.standingLine}</p> : null}
    </div>
  );
}
