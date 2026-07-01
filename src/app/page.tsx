import { StructuredData } from '@/components/seo/StructuredData';
import { PromptLanding } from '@/components/homepage/PromptLanding';
import { ThinksDifferentlySection } from '@/components/homepage/ThinksDifferentlySection';
import { TrustLayerSection } from '@/components/homepage/TrustLayerSection';
import { InfoDrawerRow } from '@/components/homepage/InfoDrawerRow';
import { HumanFollowUpSection } from '@/components/homepage/HumanFollowUpSection';

/**
 * Homepage — prompt-first (Surface 1 v3.0). The prompt landing is the first screen;
 * the calm static narrative and the pulled-not-pushed drawers sit below the fold.
 * The dynamic funnel sections (bottleneck surface, problem mirror, path
 * recommendation, briefing/email/rooms) are removed — their content now lives in the
 * embedded review conversation and on the token-gated customized client page.
 */
export default function HomePage() {
  return (
    <>
      <StructuredData />
      <PromptLanding />
      <ThinksDifferentlySection />
      <TrustLayerSection />
      <InfoDrawerRow />
      <HumanFollowUpSection />
    </>
  );
}
