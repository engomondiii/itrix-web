'use client';

import { SituationFraming } from '@/components/center/SituationFraming';
import { MainQuestion } from '@/components/center/MainQuestion';
import { SupportingLine } from '@/components/center/SupportingLine';
import { ExamplePromptGrid } from '@/components/center/ExamplePromptGrid';
import { PathwayHint } from '@/components/center/PathwayHint';
import { Composer } from '@/components/composer/Composer';

/**
 * THE APPROVED INVARIANT CENTER — the seven elements, in order (§2.1):
 *
 *   1  situation framing   "You already know computation is holding you back."
 *   2  main question       "What would you like computation to do better?"
 *   3  supporting line
 *   4  composer            attach + arrow, NO counter, NO "Begin review" button
 *   5  safety notice       (inside the composer footer)
 *   6  five example prompts, one per functional family
 *   7  pathway hint
 *
 * Extracted so the centre exists in exactly ONE place. It was previously inlined
 * in ArrivalLanding and again as a fallback elsewhere; two copies of an
 * "invariant" centre is how a centre stops being invariant.
 *
 * It carries no chrome of its own — no header, no rails, no footer. The caller
 * decides what surrounds it, which is what lets the same markup serve both the
 * full arrival screen and a bare fallback inside the conversation shell.
 */
export function ArrivalCenter() {
  return (
    <section className="arrival-center" aria-labelledby="hero-title">
      <SituationFraming />
      <MainQuestion id="main-question" />
      <SupportingLine />
      <Composer variant="arrival" labelledBy="main-question" />
      <ExamplePromptGrid />
      <PathwayHint />
    </section>
  );
}
