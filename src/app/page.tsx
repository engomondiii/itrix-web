import { StructuredData } from '@/components/seo/StructuredData';
import { HeroSection } from '@/components/homepage/HeroSection';
import { BottleneckReviewSurface } from '@/components/homepage/BottleneckReviewSurface';
import { ThinksDifferentlySection } from '@/components/homepage/ThinksDifferentlySection';
import { ProblemMirrorSection } from '@/components/homepage/ProblemMirrorSection';
import { PathRecommendationSection } from '@/components/homepage/PathRecommendationSection';
import { BriefingPreviewSection } from '@/components/homepage/BriefingPreviewSection';
import { TrustLayerSection } from '@/components/homepage/TrustLayerSection';
import { VisitorRoomsSection } from '@/components/homepage/VisitorRoomsSection';
import { EmailCaptureSection } from '@/components/homepage/EmailCaptureSection';
import { HumanFollowUpSection } from '@/components/homepage/HumanFollowUpSection';

/**
 * Homepage — fully assembled in Phase 3: the static narrative (Phase 2) interleaved
 * with the live funnel surface and dynamic sections. The review surface warms the
 * review store; visitors continue at /review.
 */
export default function HomePage() {
  return (
    <>
      <StructuredData />
      <HeroSection />
      <BottleneckReviewSurface />
      <ThinksDifferentlySection />
      <ProblemMirrorSection />
      <PathRecommendationSection />
      <BriefingPreviewSection />
      <TrustLayerSection />
      <VisitorRoomsSection />
      <EmailCaptureSection />
      <HumanFollowUpSection />
    </>
  );
}
