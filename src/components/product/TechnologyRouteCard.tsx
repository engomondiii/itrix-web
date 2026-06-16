import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { PatentReference } from '@/components/technology/PatentReference';
import type { Technology } from '@/types/product.types';

/** Shows which technology route powers a given product capability. */
export function TechnologyRouteCard({ tech, relevance }: { tech: Technology; relevance: string }) {
  return (
    <Card variant="default" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-card-title text-indigo-950">{tech.name}</h3>
        <Tag>{tech.gap}</Tag>
      </div>
      <p className="text-secondary text-ink-700">{tech.oneLiner}</p>
      <p className="text-caption text-ink-500">{relevance}</p>
      {tech.patentRef ? <PatentReference patentRef={tech.patentRef} className="mt-auto pt-1" /> : null}
    </Card>
  );
}
