import type { ProductRoute, TechnologyId } from '@/types/product.types';
import { routes } from '@/constants/routes';

export interface ProductRouteInfo {
  route: ProductRoute;
  label: string;
  blurb: string;
  href: string;
  technologies: TechnologyId[];
}

/** Display + routing metadata for each product route (used by path recommendation + result). */
export const PRODUCT_ROUTES: Record<ProductRoute, ProductRouteInfo> = {
  undetermined: {
    route: 'undetermined',
    label: 'Not yet assessed',
    blurb: 'No product route has been selected. Discovery can identify useful hypotheses without implying qualification.',
    href: routes.technology,
    technologies: [],
  },
  astop: {
    route: 'astop',
    label: 'ASTOP',
    blurb: 'ASTOP is the observation product. A controlled opportunity begins only after its relevance is separately established.',
    href: routes.astop,
    technologies: [],
  },
  alpha_compute: {
    route: 'alpha_compute',
    label: 'ALPHA Compute',
    blurb: 'Your bottleneck looks like a representation problem — start by diagnosing the form of the computation.',
    href: routes.alphaCompute,
    technologies: ['axiom', 'cre'],
  },
  alpha_core: {
    route: 'alpha_core',
    label: 'ALPHA Core',
    blurb: 'Your bottleneck looks like a runtime problem — start by validating whether a transformed form can run.',
    href: routes.alphaCore,
    technologies: ['fqnm', 'boundary_aware'],
  },
  both: {
    route: 'both',
    label: 'ALPHA Compute + Core',
    blurb: 'This historical multi-product route does not itself establish qualification; each product gate remains separate.',
    href: routes.alphaCompute,
    technologies: ['axiom', 'cre', 'fqnm', 'boundary_aware'],
  },
  general: {
    route: 'general',
    label: 'General enquiry',
    blurb: 'This legacy general route is treated as not yet assessed, not as an ALPHA qualification.',
    href: routes.technology,
    technologies: ['axiom'],
  },
};

export function getProductRoute(route: ProductRoute): ProductRouteInfo {
  return PRODUCT_ROUTES[route];
}
