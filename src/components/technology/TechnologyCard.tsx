import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { PatentReference } from './PatentReference';
import type { Technology } from '@/types/product.types';

export interface TechnologyCardProps {
  tech: Technology;
  href?: string;
}

export function TechnologyCard({ tech, href }: TechnologyCardProps) {
  const body = (
    <Card variant="default" interactive={!!href} className="flex h-full flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-web-h3 text-indigo-950">{tech.name}</h3>
        <span className="text-caption text-ink-400">{tech.expansion}</span>
      </div>
      <Tag>{tech.gap}</Tag>
      <p className="text-secondary text-ink-700">{tech.oneLiner}</p>
      {tech.patentRef ? <PatentReference patentRef={tech.patentRef} className="mt-auto pt-2" /> : null}
    </Card>
  );
  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}
