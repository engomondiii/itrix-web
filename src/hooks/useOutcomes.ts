'use client';

import { successApi } from '@/lib/api/successApi';
import { siteConfig } from '@/config/site.config';
import { usePortalResource } from './usePortalResource';
import type { Outcome } from '@/types/success.types';

/**
 * Progress against the agreed CUSTOMER outcomes.
 *
 * Never an internal sales target, a pipeline stage or a commercial probability —
 * the type has nowhere to put one, and the backend serializer strips them before
 * the payload leaves the server.
 */
export function useOutcomes() {
  const r = usePortalResource<{ outcomes: Outcome[] }>(() => successApi.outcomes(), {
    enabled: siteConfig.featureFlags.customerSuccess,
  });
  return { ...r, outcomes: r.data?.outcomes ?? [] };
}
