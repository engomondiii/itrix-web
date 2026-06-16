import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { getProductRoute } from '@/lib/content/productRoutes';
import { TECHNOLOGIES } from '@/constants/products';
import type { ProductRoute } from '@/types/product.types';
import type { TechnologyId } from '@/types/product.types';

export function ProductRouteCard({ route, technologies }: { route: ProductRoute; technologies: TechnologyId[] }) {
  const info = getProductRoute(route);
  return (
    <Card variant="featured" className="flex flex-col gap-3">
      <SectionLabel tone="gold" withRule={false}>Recommended starting point</SectionLabel>
      <h3 className="text-web-h3 text-indigo-950">{info.label}</h3>
      <p className="text-secondary text-ink-700">{info.blurb}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((t) => (
          <Tag key={t}>{TECHNOLOGIES[t]?.name ?? t}</Tag>
        ))}
      </div>
      <div className="mt-2">
        <Link href={info.href}>
          <Button variant="primary" size="md">Explore {info.label}</Button>
        </Link>
      </div>
    </Card>
  );
}
