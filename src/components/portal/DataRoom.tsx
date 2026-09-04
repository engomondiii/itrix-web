'use client';

import { DocumentFolder } from './DocumentFolder';
import { DataRoomLockedState } from './DataRoomLockedState';
import { ConfidentialityBanner } from './ConfidentialityBanner';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { usePortalCopy } from '@/lib/i18n/portalLocale';
import type { PortalDataRoom } from '@/types/portal.types';
import { useLocaleStore } from '@/store/localeStore';

/**
 * Documents + restricted data room. The backend is the sole authorization authority.
 * NDA state is displayed as a protection prerequisite only; it never unlocks content.
 */
export function DataRoom({ data }: { data: PortalDataRoom }) {
  const portalCopy = usePortalCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-structure-900">{portalCopy.documents.header}</h2>
        <p className="reading text-ink-secondary">{portalCopy.documents.intro}</p>
      </header>

      <ConfidentialityBanner />

      <section className="flex flex-col gap-3">
        <SectionLabel>{ko ? '현재 이용 가능' : 'Available now'}</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {(data.openFolders ?? []).map((f) => (
            <DocumentFolder key={f.folder} folder={f.folder} documents={f.documents} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel tone="gold">{ko ? '제한 자료' : 'Restricted materials'}</SectionLabel>
        {data.dataRoomAuthorized ? (
          <>
            <div className="rounded-md border border-border-soft bg-surface px-4 py-3">
              <p className="text-secondary text-ink-secondary">{portalCopy.documents.dataRoomUnlocked.body}</p>
            </div>
            {(data.dataRoomFolders ?? []).length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {(data.dataRoomFolders ?? []).map((f) => (
                  <DocumentFolder key={f.folder} folder={f.folder} documents={f.documents} />
                ))}
              </div>
            ) : (
              <p className="text-secondary text-ink-secondary">
                {ko ? '이 워크스페이스에 추가로 승인된 제한 자료가 아직 없습니다.' : 'No additional material has been authorized for this workspace yet.'}
              </p>
            )}
          </>
        ) : (
          <DataRoomLockedState data={data} />
        )}
      </section>
    </div>
  );
}
