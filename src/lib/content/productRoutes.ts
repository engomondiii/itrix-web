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
    blurb: 'This spans representation and execution — both layers apply, starting from the representation hypothesis.',
    href: routes.alphaCompute,
    technologies: ['axiom', 'cre', 'fqnm', 'boundary_aware'],
  },
  general: {
    route: 'general',
    label: 'General enquiry',
    blurb: 'Let’s start with a conversation to find where the structural advantage is.',
    href: routes.technology,
    technologies: ['axiom'],
  },
};

export function getProductRoute(route: ProductRoute): ProductRouteInfo {
  return PRODUCT_ROUTES[route];
}
