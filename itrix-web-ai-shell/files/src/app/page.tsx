import { StructuredData } from '@/components/seo/StructuredData';
import { ShellLanding } from '@/components/shell/ShellLanding';
import { ThinksDifferentlySection } from '@/components/homepage/ThinksDifferentlySection';
import { TrustLayerSection } from '@/components/homepage/TrustLayerSection';
import { InfoDrawerRow } from '@/components/homepage/InfoDrawerRow';
import { HumanFollowUpSection } from '@/components/homepage/HumanFollowUpSection';

/**
 * Homepage — AI-app shell landing (Surface 1 v3.1).
 *
 * The first view is now a large, calm AI composer (ShellLanding) inside the
 * application shell — a modern AI-interface first screen rather than a marketing
 * homepage. It still obeys the spec: prompt-first, one question, soft examples,
 * the exact confidentiality line, one primary action; the composer seeds the
 * review store and moves into /review.
 *
 * The calm static narrative and the pulled-not-pushed drawers remain, moved below
 * the fold and anchored at #learn-more (the rail's "Learn more" entry and the
 * landing's scroll affordance both target this anchor). The old dynamic funnel
 * sections stay removed — their content lives in the review conversation and the
 * token-gated client page.
 */
export default function HomePage() {
  return (
    <>
      <StructuredData />
      <ShellLanding />
      <div id="learn-more" className="scroll-mt-16">
        <ThinksDifferentlySection />
        <TrustLayerSection />
        <InfoDrawerRow />
        <HumanFollowUpSection />
      </div>
    </>
  );
}
