'use client';

import { useState } from 'react';
import { DocumentFolder } from './DocumentFolder';
import { DataRoomLockedState } from './DataRoomLockedState';
import { ConfidentialityBanner } from './ConfidentialityBanner';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { PortalDataRoom } from '@/types/portal.types';
import type { JourneyRevealPayload } from '@/lib/realtime/socketEvents';

/**
 * Documents + the NDA-gated data room (§65). Open folders are always available; the
 * data room shows its locked or unlocked state based on the client's NDA status.
 *
 * Phase 3: reveal ④ — when the backend pushes a journey.reveal for the `data_room`
 * surface (state ENGAGED, NDA in place), the room unlocks live without a reload. The
 * lock is still enforced by the backend disclosure filter (locked docs arrive with a
 * null href), so this only reflects an authorization the server has already granted.
 */
export function DataRoom({ data }: { data: PortalDataRoom }) {
  const [liveUnlocked, setLiveUnlocked] = useState(false);
  const unlocked = data.ndaSigned || liveUnlocked;

  useSocket({
    url: wsUrls.portal(),
    enabled: siteConfig.featureFlags.realtime && !data.ndaSigned,
    handlers: {
      'journey.reveal': (p: JourneyRevealPayload) => {
        if (p.reveal.surface === 'data_room' || p.state === 'ENGAGED') {
          setLiveUnlocked(true);
        }
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-indigo-950">{PORTAL_COPY.documents.header}</h2>
        <p className="reading text-ink-700">{PORTAL_COPY.documents.intro}</p>
      </header>

      <ConfidentialityBanner />

      <section className="flex flex-col gap-3">
        <SectionLabel>Available now</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.openFolders.map((f) => (
            <DocumentFolder key={f.folder} folder={f.folder} documents={f.documents} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel tone="gold">Data room</SectionLabel>
        {unlocked ? (
          <>
            <div className="rounded-md border border-line-subtle bg-surface-warm px-4 py-3">
              <p className="text-secondary text-ink-700">{PORTAL_COPY.documents.dataRoomUnlocked.body}</p>
            </div>
            {data.dataRoomFolders.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.dataRoomFolders.map((f) => (
                  <DocumentFolder key={f.folder} folder={f.folder} documents={f.documents} />
                ))}
              </div>
            ) : (
              <p className="text-secondary text-ink-500">
                Your data room is being prepared. New material will appear here as the team adds it.
              </p>
            )}
          </>
        ) : (
          <DataRoomLockedState />
        )}
      </section>
    </div>
  );
}
