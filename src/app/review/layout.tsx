import type { ReactNode } from 'react';
import { buildMetadata } from '@/components/seo/PageMeta';
import { ReviewLayout } from '@/components/layout/ReviewLayout';
import { ReviewProvider } from '@/context/ReviewContext';
import { LeadProvider } from '@/context/LeadContext';
import { routes } from '@/constants/routes';

/**
 * Layout for the Compute Bottleneck Review segment. Provides the review + lead
 * contexts and the focused ReviewLayout chrome. Funnel pages are noindex.
 *
 * Production note: to drop the global Header/Footer for this flow entirely, move
 * the review pages into a (review) route group with this as its group layout.
 */
export const metadata = buildMetadata({ title: 'Compute Bottleneck Review', path: routes.review, noIndex: true });

export default function ReviewSegmentLayout({ children }: { children: ReactNode }) {
  return (
    <ReviewProvider>
      <LeadProvider>
        <ReviewLayout>{children}</ReviewLayout>
      </LeadProvider>
    </ReviewProvider>
  );
}
