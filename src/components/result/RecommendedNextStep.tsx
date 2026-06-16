import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getProductRoute } from '@/lib/content/productRoutes';
import { routes } from '@/constants/routes';
import type { ProductRoute } from '@/types/product.types';
import type { LeadTier } from '@/types/lead.types';

export interface RecommendedNextStepProps {
  text: string;
  tier: LeadTier;
  route: ProductRoute;
}

export function RecommendedNextStep({ text, tier, route }: RecommendedNextStepProps) {
  const info = getProductRoute(route);
  return (
    <Card variant="warm" className="flex flex-col gap-4">
      <div>
        <h2 className="text-section text-indigo-950">Recommended next step</h2>
        <p className="mt-2 text-secondary text-ink-700">{text}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href={info.href}>
          <Button variant="primary" size="md">Explore {info.label}</Button>
        </Link>
        {tier <= 2 ? (
          <Link href={routes.reviewConfirmation}>
            <Button variant="secondary" size="md">Confirm contact details</Button>
          </Link>
        ) : (
          <Link href={routes.technology}>
            <Button variant="secondary" size="md">Read the technology</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
