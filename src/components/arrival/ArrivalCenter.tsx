'use client';

import { MainQuestion } from '@/components/center/MainQuestion';
import { SupportingLine } from '@/components/center/SupportingLine';
import { RotatingQuestionCarousel } from '@/components/center/RotatingQuestionCarousel';
import { PathwayHint } from '@/components/center/PathwayHint';
import { Composer } from '@/components/composer/Composer';

/**
 * THE APPROVED INVARIANT CENTER — v6.0.
 *
 * The order (Surface 1 v6.0 §2.1, elements 3–8; the wordmark, Sign in and the
 * legal strip are the shell's, not the centre's):
 *
 *   3  main question    "What would you like computation to do better?" — the H1
 *   4  supporting line
 *   5  composer         attach + the itriX X, NO counter, NO "Begin review"
 *   6  safety notice    (inside the composer footer)
 *   7  rotating prompts one at a time, five in the cycle, one per family
 *   8  pathway hint
 *
 * ── WHAT LEFT ───────────────────────────────────────────────────────────────
 * `SituationFraming` is gone. "You already know computation is holding you back."
 * has left the product, and the question inherited the display scale (R31). There
 * is now exactly ONE large sentence here, and it is a question.
 *
 * `ExamplePromptGrid` is gone too, replaced by the rotating carousel. Same five
 * prompts, same family mapping, same populate-never-submit rule.
 *
 * Extracted so the centre exists in exactly ONE place. It was previously inlined in
 * the landing and again as a fallback elsewhere; two copies of an "invariant"
 * centre is how a centre stops being invariant.
 *
 * It carries no chrome of its own. The caller decides what surrounds it, which is
 * what lets the same markup serve the arrival shell and a bare fallback inside the
 * working shell.
 */
export function ArrivalCenter() {
  return (
    <section className="arrival-center" aria-labelledby="main-question">
      <MainQuestion id="main-question" />
      <SupportingLine />
      <Composer variant="arrival" labelledBy="main-question" />
      <RotatingQuestionCarousel />
      <PathwayHint />
    </section>
  );
}
