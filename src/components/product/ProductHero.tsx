import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { BackgroundGrid } from '@/components/visual/BackgroundGrid';
import { CTA } from '@/lib/content/ctaCopy';
import type { ProductInfo } from '@/types/product.types';

export function ProductHero({ product }: { product: ProductInfo }) {
  return (
    <section className="relative overflow-hidden border-b border-border-medium bg-canvas">
      <BackgroundGrid />
      <div className="container-page relative py-16">
        <SectionLabel>{product.layer}</SectionLabel>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-web-h1 text-structure-900">{product.name}</h1>
          <Tag>{product.layer}</Tag>
        </div>
        <p className="reading mt-4 text-web-lead text-ink-secondary">{product.thesis}</p>
        <p className="mt-2 text-secondary text-ink-secondary">Built for {product.buyer}.</p>
        <div className="mt-8">
          <Link href={CTA.beginReview.href}>
            <Button variant="primary" size="lg">{CTA.beginReview.label}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
