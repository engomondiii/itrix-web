'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { Spinner } from '@/components/ui/Spinner';
import { KnowledgeShelf } from '@/components/success/KnowledgeShelf';
import { ReleaseNoteList } from '@/components/success/ReleaseNoteList';
import { usePortalResource } from '@/hooks/usePortalResource';
import { successApi } from '@/lib/api/successApi';
import { siteConfig } from '@/config/site.config';
import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { KnowledgeItem, ReleaseNote } from '@/types/success.types';

/** Role-based training, documentation, recommended practices and release notes. */
export default function KnowledgePage() {
  const { data, loading } = usePortalResource<{ items: KnowledgeItem[]; releaseNotes: ReleaseNote[] }>(
    () => successApi.knowledge(),
    { enabled: siteConfig.featureFlags.customerSuccess },
  );

  return (
    <>
      <PortalTopbar title="Learning" />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-8">
        <header>
          <h1 className="font-display text-web-h2 text-ink-primary">{SUCCESS_COPY.knowledge.title}</h1>
          <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{SUCCESS_COPY.knowledge.intro}</p>
        </header>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <>
            <KnowledgeShelf items={data?.items ?? []} />
            <ReleaseNoteList notes={data?.releaseNotes ?? []} />
          </>
        )}
      </div>
    </>
  );
}
