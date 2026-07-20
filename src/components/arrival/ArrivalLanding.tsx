'use client';

import { useState } from 'react';
import { ArrivalHeader } from './ArrivalHeader';
import { ArrivalLeftRail } from './ArrivalLeftRail';
import { ArrivalRightRail } from './ArrivalRightRail';
import { ArrivalFooter } from './ArrivalFooter';
import { ArrivalMotifs } from './ArrivalMotifs';
import { NdaDialog } from './NdaDialog';
import { SituationFraming } from '@/components/center/SituationFraming';
import { MainQuestion } from '@/components/center/MainQuestion';
import { SupportingLine } from '@/components/center/SupportingLine';
import { ExamplePromptGrid } from '@/components/center/ExamplePromptGrid';
import { PathwayHint } from '@/components/center/PathwayHint';
import { Composer } from '@/components/composer/Composer';

/**
 * THE ARRIVAL SCREEN — the approved landing, before the visitor has spoken.
 *
 * This is the reconciliation the change request asked for. Two surfaces, one
 * threshold:
 *
 *   BEFORE the first prompt   the approved three-column arrival screen — header,
 *                             quiet left rail, big centre, quiet right rail,
 *                             footer. Exactly the package that was signed off.
 *   AFTER the first prompt    the conversation shell — sidebar and transcript,
 *                             the composer docked, no header and no rails.
 *
 * The switch is not a navigation. `useArrivalMode` reads whether the active
 * thread has any turns; the moment one exists this component stops rendering and
 * ConversationColumn takes over in the same mounted tree. R21 holds: submitting
 * still does not route.
 *
 * The centre is IDENTICAL in both — same components, same copy, same composer.
 * That is the point of an invariant centre: the visitor never relearns the one
 * thing they came to use.
 *
 * Rail growth is deliberately absent. The approved package says the rails "can
 * grow in later journey states"; in v5.0 they do not, because the conversation
 * itself is what grows. A rail that grew alongside a transcript would be the
 * two-rail shell v5.0 retired.
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

          <section className="arrival-center" aria-labelledby="hero-title">
            <SituationFraming />
            <MainQuestion id="main-question" />
            <SupportingLine />
            <Composer variant="arrival" labelledBy="main-question" />
            <ExamplePromptGrid />
            <PathwayHint />
          </section>

          <ArrivalRightRail onOpenNda={() => setNdaOpen(true)} />
        </div>

        <NdaDialog open={ndaOpen} onClose={() => setNdaOpen(false)} />
      </main>

      <ArrivalFooter onOpenDisclosure={() => setNdaOpen(true)} />
    </div>
  );
}
