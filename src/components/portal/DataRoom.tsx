'use client';

import { useState } from 'react';
import { DocumentFolder } from './DocumentFolder';
import { DataRoomLockedState } from './DataRoomLockedState';
import { ConfidentialityBanner } from './ConfidentialityBanner';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import { isWorkspaceState } from '@/lib/journey/journeyStates';
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
        // v4.0: ENGAGED split into ASSESSMENT / POC / INTEGRATION, so the
        // unlock condition is "any workspace state" rather than one enum member.
        if (p.reveal.surface === 'data_room' || isWorkspaceState(p.state)) {
          setLiveUnlocked(true);
        }
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-structure-900">{PORTAL_COPY.documents.header}</h2>
        <p className="reading text-ink-secondary">{PORTAL_COPY.documents.intro}</p>
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
            <div className="rounded-md border border-border-soft bg-surface px-4 py-3">
              <p className="text-secondary text-ink-secondary">{PORTAL_COPY.documents.dataRoomUnlocked.body}</p>
            </div>
            {data.dataRoomFolders.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.dataRoomFolders.map((f) => (
                  <DocumentFolder key={f.folder} folder={f.folder} documents={f.documents} />
                ))}
              </div>
            ) : (
              <p className="text-secondary text-ink-secondary">
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
