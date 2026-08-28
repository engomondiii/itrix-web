'use client';

import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { PatentReference } from '@/components/technology/PatentReference';
import { technologyCopy } from '@/lib/i18n/productsLocale';
import { useLocaleStore } from '@/store/localeStore';
import type { Technology } from '@/types/product.types';

/** Shows which technology route can be relevant to a product capability without implying eligibility. */
export function TechnologyRouteCard({ tech, relevance, relevanceKo }: { tech: Technology; relevance: string; relevanceKo?: string }) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = technologyCopy(locale, tech.id, tech);
  return (
    <Card variant="default" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-card-title text-structure-900">{tech.name}</h3>
        <Tag>{copy.gap}</Tag>
      </div>
      <p className="text-secondary text-ink-secondary">{copy.oneLiner}</p>
      <p className="text-caption text-ink-secondary">{locale === 'ko' && relevanceKo ? relevanceKo : relevance}</p>
      {tech.patentRef ? <PatentReference patentRef={tech.patentRef} className="mt-auto pt-1" /> : null}
    </Card>
  );
}
