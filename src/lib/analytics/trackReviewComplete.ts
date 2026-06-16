import { trackEvent } from './trackEvent';
import type { LeadTier } from '@/types/lead.types';
import type { ProductRoute } from '@/types/product.types';

export function trackReviewComplete(input: {
  tier: LeadTier;
  totalScore: number;
  productRoute: ProductRoute;
  leadId?: string | null;
}): void {
  trackEvent('review_complete', {
    tier: input.tier,
    total_score: input.totalScore,
    product_route: input.productRoute,
    lead_id: input.leadId ?? null,
  });
}
