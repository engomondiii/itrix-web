'use client';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { PatentReference } from './PatentReference';
import { useLocaleStore } from '@/store/localeStore';
import { technologyCopy } from '@/lib/i18n/productsLocale';
import type { Technology } from '@/types/product.types';
export interface TechnologyCardProps { tech: Technology; href?: string; }
export function TechnologyCard({ tech, href }: TechnologyCardProps) {
  const locale=useLocaleStore((s)=>s.locale); const shown=technologyCopy(locale,tech.id);
  const body=<Card variant="default" interactive={!!href} className="flex h-full flex-col gap-3">
    <div className="flex items-baseline justify-between gap-3"><h3 className="text-web-h3 text-structure-900">{shown.name}</h3><span className="text-caption text-ink-secondary">{shown.expansion}</span></div>
    <Tag>{shown.gap}</Tag><p className="text-secondary text-ink-secondary">{shown.oneLiner}</p>
    {shown.patentRef?<PatentReference patentRef={shown.patentRef} className="mt-auto pt-2"/>:null}
  </Card>;
  return href?<Link href={href} className="block h-full">{body}</Link>:body;
}
