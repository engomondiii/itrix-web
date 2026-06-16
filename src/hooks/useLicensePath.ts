'use client';

import { useReviewStore } from '@/store/reviewStore';
import { useLeadStore } from '@/store/leadStore';
import { routeLicense } from '@/lib/routing/licenseRouter';
import { getLicensePathway } from '@/lib/content/licensePathways';

export function useLicensePath() {
  const answers = useReviewStore((s) => s.answers);
  const storedRoute = useLeadStore((s) => s.productRoute); // presence indicates backend ran
  const storedPathway = useLeadStore((s) => s.licensePathway);

  const pathway = storedRoute ? storedPathway : routeLicense(answers);
  return { pathway, info: pathway ? getLicensePathway(pathway) : null };
}
