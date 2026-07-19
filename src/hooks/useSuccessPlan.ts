'use client';

import { successApi } from '@/lib/api/successApi';
import { siteConfig } from '@/config/site.config';
import { usePortalResource } from './usePortalResource';
import type { SuccessPlan } from '@/types/success.types';

/** The shared 30/60/90 plan: goals, owners on both sides, dependencies, dates. */
export function useSuccessPlan() {
  return usePortalResource<SuccessPlan>(() => successApi.plan(), {
    enabled: siteConfig.featureFlags.customerSuccess,
  });
}
