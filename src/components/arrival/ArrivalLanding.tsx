'use client';

import { useState } from 'react';
import { ArrivalHeader } from './ArrivalHeader';
import { ArrivalLeftRail } from './ArrivalLeftRail';
import { ArrivalRightRail } from './ArrivalRightRail';
import { ArrivalFooter } from './ArrivalFooter';
import { ArrivalMotifs } from './ArrivalMotifs';
import { ArrivalCenter } from './ArrivalCenter';
import { NdaDialog } from './NdaDialog';

/**
 * THE ARRIVAL SCREEN — the approved landing, before the visitor has spoken.
 *
 * Two surfaces, one threshold:
 *
 *   BEFORE the first prompt   this — header, quiet left rail, big centre, quiet
 *                             right rail, footer. The signed-off package.
 *   AFTER the first prompt    the conversation shell, with the transcript.
 *
 * The switch is a re-render of a mounted tree, not a navigation (R21).
 *
 * IT MOUNTS NO SHELL AND IS MOUNTED BY NO SHELL. SiteChrome renders this bare —
 * it is a complete page, with its own header and footer. Wrapping it in the
 * conversation shell would put a sidebar beside a screen the approved design
 * does not have one on, and that is precisely the duplicate-sidebar bug this
 * component's contract now prevents.
 */
export function ArrivalLanding() {
  const [ndaOpen, setNdaOpen] = useState(false);

  return (
    <div className="arrival-page" data-journey-state="arrival">
      <ArrivalHeader />

      <main id="content" className="arrival-hero">
        <ArrivalMotifs />

        <div className="arrival-shell">
          <ArrivalLeftRail />
          <ArrivalCenter />
          <ArrivalRightRail onOpenNda={() => setNdaOpen(true)} />
        </div>

        <NdaDialog open={ndaOpen} onClose={() => setNdaOpen(false)} />
      </main>

      <ArrivalFooter onOpenDisclosure={() => setNdaOpen(true)} />
    </div>
  );
}
