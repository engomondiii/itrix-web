'use client';

import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { BackgroundGrid } from '@/components/visual/BackgroundGrid';
import { CTA } from '@/lib/content/ctaCopy';
import { productCopy } from '@/lib/i18n/productsLocale';
import { useLocaleStore } from '@/store/localeStore';
import type { ProductInfo } from '@/types/product.types';

const CTA_KO = {
  beginReview: '검토 시작하기',
};

export function ProductHero({ product }: { product: ProductInfo }) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = productCopy(locale, product.route);
  return (
    <section className="relative overflow-hidden border-b border-border-medium bg-canvas">
      <BackgroundGrid />
      <div className="container-page relative py-16">
        <SectionLabel>{copy.layer}</SectionLabel>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-web-h1 text-structure-900">{product.name}</h1>
          <Tag>{copy.layer}</Tag>
        </div>
        <p className="reading mt-4 text-web-lead text-ink-secondary">{copy.thesis}</p>
        <p className="mt-2 text-secondary text-ink-secondary">
          {locale === 'ko' ? `${copy.buyer}을(를) 위해 설계되었습니다.` : `Built for ${copy.buyer}.`}
        </p>
        <div className="mt-8">
          <Link href={CTA.beginReview.href}>
            <Button variant="primary" size="lg">{locale === 'ko' ? CTA_KO.beginReview : CTA.beginReview.label}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
