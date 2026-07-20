import { StructuredData } from '@/components/seo/StructuredData';
import { ConversationColumn } from '@/components/shell/ConversationColumn';
import { SituationFraming } from '@/components/center/SituationFraming';
import { MainQuestion } from '@/components/center/MainQuestion';
import { SupportingLine } from '@/components/center/SupportingLine';
import { Composer } from '@/components/composer/Composer';
import { ExamplePromptGrid } from '@/components/center/ExamplePromptGrid';
import { PathwayHint } from '@/components/center/PathwayHint';

/**
 * THE MINIMAL APPROVED CENTER (Surface 1 v5.0 §2, State 1).
 *
 *   NON-NEGOTIABLE
 *   Retain the approved center and the exact opening question. The first prompt
 *   is the actual beginning of the review. Do not replace it with a new opening
 *   and do not ask the visitor to repeat the same input.
 *
 * The seven center elements, in order (§2.1):
 *   1  situation framing   "You already know computation is holding you back."
 *   2  main question       "What would you like computation to do better?"
 *   3  supporting line
 *   4  composer            attach + arrow, NO counter, NO "Begin review" button
 *   5  safety notice       (rendered inside the composer footer)
 *   6  five example prompts, one per functional family
 *   7  pathway hint
 *
 * THE PATHWAY HINT IS THE LAST THING ON THIS ROUTE (R29). There is no audience
 * strip, no how-it-works step list, no marketing footer, and no scrollable
 * narrative below the fold at any breakpoint. The content that lived at
 * #learn-more in v4.0 is RELOCATED, not deleted — the drawers and the marketing
 * routes are reached from the sidebar's Explore group, so R5 is preserved.
 *
 * Submitting does not navigate. ConversationColumn keeps this component mounted
 * and swaps the centre for the transcript in place (R21).
 */
export default function HomePage() {
  return (
    <>
      <StructuredData />

      <ConversationColumn
        emptyState={
          <section className="arrival" aria-labelledby="main-question">
            {/* Structural motif from the approved composition. Decorative. */}
            <div aria-hidden="true" className="arrival__geometry arrival__geometry--left" />
            <div aria-hidden="true" className="arrival__geometry arrival__geometry--right" />

            <div className="arrival__inner">
              <SituationFraming />
              <MainQuestion id="main-question" />
              <SupportingLine />
              <Composer variant="arrival" labelledBy="main-question" />
              <ExamplePromptGrid />
              <PathwayHint />
            </div>
          </section>
        }
      />
    </>
  );
}
