import type { ReactNode } from 'react';
import { buildMetadata } from '@/components/seo/PageMeta';
import { ReviewProvider } from '@/context/ReviewContext';
import { LeadProvider } from '@/context/LeadContext';

/**
 * Layout for the review segment.
 *
 * v5.0 CHANGE: the ReviewLayout chrome is GONE. In v4.0 the review was a
 * separate funnel surface with its own header; in v5.0 a review IS the
 * conversation, and it renders inside the same ConversationShell as every other
 * route (Surface 1 v5.0 §00.1 change 1). Wrapping it again would stack two
 * navigations.
 *
 * The two providers remain because the legacy /review/qualify and
 * /review/preparing sub-routes still consume them. Those routes are retired in
 * Phase 2, when States 2–6 render in-thread.
 *
 * Funnel routes are noindex.
 */
export const metadata = buildMetadata({
  title: 'Compute Bottleneck Review',
  path: '/review',
  noIndex: true,
});

export default function ReviewSegmentLayout({ children }: { children: ReactNode }) {
  return (
    <ReviewProvider>
      <LeadProvider>{children}</LeadProvider>
    </ReviewProvider>
  );
}
