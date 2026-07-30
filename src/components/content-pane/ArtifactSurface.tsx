'use client';

import { ArtifactBlock } from '@/components/artifacts/ArtifactBlock';
import { useContentPaneContext } from '@/context/ContentPaneContext';
import { ARTIFACT_TITLE } from '@/lib/journey/artifactTypes';
import { PANE_COPY } from '@/lib/content/paneCopy';
import { PaneEmptyState } from './PaneEmptyState';
import type { Artifact } from '@/types/artifact.types';

/**
 * The artifacts a thread has produced, read one at a time.
 *
 * ── THE SAME RENDERER AS THE TRANSCRIPT'S INLINE FALLBACK ───────────────────
 * `ArtifactBlock` is used here and in the reference card's inline expansion, so the
 * two views cannot drift — and so every rule ArtifactBlock enforces holds in both:
 * an unknown type renders nothing rather than falling back to a generic renderer,
 * and an artifact that is not approved does not render its payload at all.
 *
 * The switcher is a plain list, newest first. It is not a "recommended next
 * document" strip: the pane is a reading surface and nothing in it may rank what the
 * visitor should look at commercially.
 */
export function ArtifactSurface({ items }: { items?: Artifact[] }) {
  const { artifacts, activeArtifact, focusArtifact } = useContentPaneContext();
  const list = items ?? artifacts;

  if (list.length === 0) return <PaneEmptyState />;

  /* When a section narrows the list, the globally-active artifact may not be in it. */
  const current = list.find((a) => a.id === activeArtifact?.id) ?? list[0];

  return (
    <div className="pane__artifacts">
      {list.length > 1 ? (
        <nav className="pane__switcher" aria-label={PANE_COPY.artifactSwitcherLabel}>
          <ul>
            {list.map((artifact) => (
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
  );
}
