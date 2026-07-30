'use client';

import { useContentPaneContext } from '@/context/ContentPaneContext';
import { ArtifactBlock } from '@/components/artifacts/ArtifactBlock';
import { ARTIFACT_TITLE } from '@/lib/journey/artifactTypes';
import { PANE_COPY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';
import type { ContentPaneSection } from '@/lib/journey/contentPaneSections';
import type { Artifact } from '@/types/artifact.types';
import type { ReactNode } from 'react';

/**
 * A section backed by GOVERNED ARTIFACTS the thread has produced.
 *
 * ── THE ARTIFACT IS PREFERRED OVER THE PORTAL PAYLOAD, ALWAYS ───────────────
 * `documents`, `workspace_assessment`, `workspace_poc` and `workspace_integration`
 * each have two possible sources: the artifact delivered into the thread, and the
 * workspace API payload behind a client-JWT. This renders the ARTIFACT when one
 * exists, because the artifact is the governed thing — it carries a
 * `governanceStatus`, a version and a disclosure level, and `ArtifactBlock` refuses
 * to render a payload that is not approved.
 *
 * The portal payload is the FALLBACK, for a customer who arrived through
 * /workspace and whose thread does not carry the artifact. Each caller supplies it;
 * this component never fetches, so a section the visitor is not looking at costs no
 * request.
 */
export interface ArtifactBackedSectionProps {
  section: ContentPaneSection;
  /** Artifact types that belong to this section, newest first. */
  types: readonly string[];
  /** Rendered when the thread carries no matching artifact. */
  fallback?: ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

export function ArtifactBackedSection({
  section, types, fallback, loading = false, emptyMessage,
}: ArtifactBackedSectionProps) {
  const { artifacts, activeArtifact, focusArtifact } = useContentPaneContext();
  const items: Artifact[] = types.length
    ? artifacts.filter((a) => types.includes(a.type))
    : artifacts;

  if (items.length === 0) {
    return (
      <PaneSectionFrame section={section} loading={loading} empty={!fallback} emptyMessage={emptyMessage}>
        {fallback}
      </PaneSectionFrame>
    );
  }

  /* When a section narrows the list, the globally-active artifact may not be in it. */
  const current = items.find((a) => a.id === activeArtifact?.id) ?? items[0];

  return (
    <PaneSectionFrame section={section}>
      <div className="pane__artifacts">
        {items.length > 1 ? (
          <nav className="pane__switcher" aria-label={PANE_COPY.artifactSwitcherLabel}>
            <ul>
              {items.map((artifact) => (
                <li key={artifact.id}>
                  <button
                    type="button"
                    aria-current={artifact.id === current.id ? 'true' : undefined}
                    className="pane__switcher-item"
                    onClick={() => focusArtifact(artifact.id)}
                  >
                    {ARTIFACT_TITLE[artifact.type] ?? 'Prepared for you'}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <ArtifactBlock artifact={current} defaultOpen />
      </div>
    </PaneSectionFrame>
  );
}
