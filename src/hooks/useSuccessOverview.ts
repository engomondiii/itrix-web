'use client';

import { successApi } from '@/lib/api/successApi';
import { siteConfig } from '@/config/site.config';
import { usePortalResource } from './usePortalResource';
import type { SuccessOverview } from '@/types/success.types';

/**
 * The customer-success overview — outcomes, health, support, changes and team.
 *
 * Gated by NEXT_PUBLIC_ENABLE_CUSTOMER_SUCCESS. With the flag off nothing is
 * fetched and the zone renders its unavailable state, so Phase 3 can ship dark.
 */
export function useSuccessOverview() {
  return usePortalResource<SuccessOverview>(() => successApi.overview(), {
    enabled: siteConfig.featureFlags.customerSuccess,
  });
}
