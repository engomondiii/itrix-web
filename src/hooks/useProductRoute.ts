'use client';

import { useReviewStore } from '@/store/reviewStore';
import { useLeadStore } from '@/store/leadStore';
import { routeProduct } from '@/lib/routing/productRouter';
import { getProductRoute } from '@/lib/content/productRoutes';

export function useProductRoute() {
  const answers = useReviewStore((s) => s.answers);
  const storedRoute = useLeadStore((s) => s.productRoute);

  const route = storedRoute ?? routeProduct(answers);
  return { route, info: getProductRoute(route), fromBackend: !!storedRoute };
}
