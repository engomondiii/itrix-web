import type { ProductRoute, LicensePathway } from '@/types/product.types';
import { PRODUCT_ROUTE_LABEL, LICENSE_PATHWAYS } from '@/constants/products';

export function routeLabel(route: ProductRoute): string {
  return PRODUCT_ROUTE_LABEL[route] ?? route;
}

export function licenseLabel(pathway: LicensePathway | null): string {
  return pathway ? LICENSE_PATHWAYS[pathway].label : 'To be determined with the team';
}
