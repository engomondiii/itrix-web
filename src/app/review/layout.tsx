import type { ReactNode } from 'react';
import { buildMetadata } from '@/components/seo/PageMeta';
import { ReviewLayout } from '@/components/layout/ReviewLayout';
import { ReviewProvider } from '@/context/ReviewContext';
import { LeadProvider } from '@/context/LeadContext';
import { routes } from '@/constants/routes';

/**
 * Layout for the Compute Bottleneck Review segment. Provides the review + lead
 * contexts and the focused ReviewLayout chrome. The segment now hosts an embedded
 * conversation (intake → two-stage questions → preparing hand-off). Funnel pages
 * are noindex.
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
