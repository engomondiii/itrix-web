'use client';

import { ARTIFACT_TITLE } from '@/lib/journey/artifactTypes';
import type { Artifact } from '@/types/artifact.types';

/**
 * The header of an in-thread artifact.
 *
 * It shows a plain-language title and, when the artifact is expandable, the
 * disclosure control. What it must NOT show: the artifact type string, the
 * version number, the disclosure tier, or any internal id. Those are engineering
 * facts, not things a visitor needs.
 */
export interface ArtifactHeaderProps {
  artifact: Artifact;
  open: boolean;
  onToggle: () => void;
  regionId: string;
}

export function ArtifactHeader({ artifact, open, onToggle, regionId }: ArtifactHeaderProps) {
  const title =
    (artifact.payload?.title as string | undefined) ?? ARTIFACT_TITLE[artifact.type];

  return (
    <button
      type="button"
      className="artifact__header"
      aria-expanded={open}
      aria-controls={regionId}
      onClick={onToggle}
    >
      <span className="artifact__title">{title}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`artifact__chevron ${open ? 'artifact__chevron--open' : ''}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}
