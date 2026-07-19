import { StructuredData } from '@/components/seo/StructuredData';
import { StableCenterWorkspace } from '@/components/shell/StableCenterWorkspace';
import { SituationFraming } from '@/components/center/SituationFraming';
import { MainQuestion } from '@/components/center/MainQuestion';
import { PersistentItrixComposer } from '@/components/shell/PersistentItrixComposer';
import { PathwayHint } from '@/components/center/PathwayHint';
import { ThinksDifferentlySection } from '@/components/homepage/ThinksDifferentlySection';
import { TrustLayerSection } from '@/components/homepage/TrustLayerSection';
import { InfoDrawerRow } from '@/components/homepage/InfoDrawerRow';
import { HumanFollowUpSection } from '@/components/homepage/HumanFollowUpSection';

/**
 * Homepage — THE APPROVED INVARIANT CENTER (Surface 1 v4.0 §2, State 1).
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
 *   4  prompt composer     glass surface, 600-char counter, inline submit
 *   5  safety notice
 *   6  five example prompts, one per functional family
 *   7  pathway hint
 *
 * Everything else is BELOW the fold at #learn-more and is pulled, not pushed:
 * the calm narrative, the trust layer, the closed-by-default drawers, and the
 * human follow-up offer. No product explanation, pricing, performance claim or
 * exclusivity CTA appears before the visitor has spoken.
 *
 * The rails around this centre are ambient structure only at State 1 — that is
 * decided by RelationshipShell in app/layout.tsx, not here.
 */
export default function HomePage() {
  return (
    <>
      <StructuredData />

      <StableCenterWorkspace variant="landing">
        <SituationFraming />
        <MainQuestion id="main-question" />
        <PersistentItrixComposer mode="arrival" showExamples labelledBy="main-question" />
        <PathwayHint />
      </StableCenterWorkspace>

      <div id="learn-more" className="scroll-mt-16">
        <ThinksDifferentlySection />
        <TrustLayerSection />
        <InfoDrawerRow />
        <HumanFollowUpSection />
      </div>
    </>
  );
}
