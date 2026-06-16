import { LICENSE_PATHWAYS } from '@/constants/products';
import type { LicensePathway } from '@/types/product.types';
import { routes } from '@/constants/routes';

export { LICENSE_PATHWAYS };

export interface LicensePathwayInfo {
  pathway: LicensePathway;
  label: string;
  summary: string;
  href: string;
}

export const LICENSE_PATHWAY_INFO: Record<LicensePathway, LicensePathwayInfo> = {
  non_exclusive: {
    pathway: 'non_exclusive',
    label: LICENSE_PATHWAYS.non_exclusive.label,
    summary: LICENSE_PATHWAYS.non_exclusive.summary,
    href: routes.licensingNonExclusive,
  },
  exclusive: {
    pathway: 'exclusive',
    label: LICENSE_PATHWAYS.exclusive.label,
    summary: LICENSE_PATHWAYS.exclusive.summary,
    href: routes.licensingExclusive,
  },
  strategic: {
    pathway: 'strategic',
    label: LICENSE_PATHWAYS.strategic.label,
    summary: LICENSE_PATHWAYS.strategic.summary,
    href: routes.licensingExclusive,
  },
};

export function getLicensePathway(pathway: LicensePathway): LicensePathwayInfo {
  return LICENSE_PATHWAY_INFO[pathway];
}
