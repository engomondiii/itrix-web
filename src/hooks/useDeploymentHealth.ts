'use client';

import { successApi } from '@/lib/api/successApi';
import { siteConfig } from '@/config/site.config';
import { usePortalResource } from './usePortalResource';
import type { DeploymentHealth } from '@/types/success.types';

/**
 * Operational status, last check, incidents, versions and known limitations.
 *
 * This is the FACTUAL data a health signal is derived from. The signal itself —
 * the internal health class — never reaches this surface.
 */
export function useDeploymentHealth() {
  const r = usePortalResource<{ deployments: DeploymentHealth[] }>(() => successApi.deployments(), {
    enabled: siteConfig.featureFlags.customerSuccess,
  });
  return { ...r, deployments: r.data?.deployments ?? [] };
}
