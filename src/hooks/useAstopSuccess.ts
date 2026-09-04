'use client';

import { siteConfig } from '@/config/site.config';
import { successApi } from '@/lib/api/successApi';
import type { AstopSuccessProjection } from '@/types/astop-success.types';
import { usePortalResource } from './usePortalResource';

export function useAstopSuccess() {
  return usePortalResource<AstopSuccessProjection>(() => successApi.astop(), {
    enabled: siteConfig.featureFlags.customerSuccess,
  });
}
