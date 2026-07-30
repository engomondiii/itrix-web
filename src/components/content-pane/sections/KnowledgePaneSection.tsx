'use client';

import { KnowledgeShelf } from '@/components/success/KnowledgeShelf';
import { ReleaseNoteList } from '@/components/success/ReleaseNoteList';
import { usePortalResource } from '@/hooks/usePortalResource';
import { successApi } from '@/lib/api/successApi';
import { siteConfig } from '@/config/site.config';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';
import type { KnowledgeItem, ReleaseNote } from '@/types/success.types';

/**
 * LEARNING — training, documentation, recommended practice, and release notes.
 *
 * There is no dedicated hook for this in the repo; the shipped /workspace/success/
 * knowledge route reads it through `usePortalResource` directly, and this does the
 * same rather than adding a ninth near-identical hook.
 */
export function KnowledgePaneSection() {
  const { data, loading } = usePortalResource<{ items: KnowledgeItem[]; releaseNotes: ReleaseNote[] }>(
    () => successApi.knowledge(),
    { enabled: siteConfig.featureFlags.customerSuccess },
  );

  const items = data?.items ?? [];
  const notes = data?.releaseNotes ?? [];

  return (
    <PaneSectionFrame
      section="knowledge"
      loading={loading}
      empty={items.length === 0 && notes.length === 0}
      emptyMessage={PANE_SECTION_EMPTY.knowledge}
    >
      <div className="pane__stack">
        {items.length > 0 ? <KnowledgeShelf items={items} /> : null}
        {notes.length > 0 ? <ReleaseNoteList notes={notes} /> : null}
      </div>
    </PaneSectionFrame>
  );
}
