import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TECHNOLOGIES } from '@/constants/products';
import type { TechnologyId } from '@/types/product.types';

export interface ALPHAFitSummaryProps {
  summary: string;
  technologies: TechnologyId[];
}

export function ALPHAFitSummary({ summary, technologies }: ALPHAFitSummaryProps) {
  return (
    <Card variant="default" className="flex flex-col gap-3">
      <SectionLabel>ALPHA fit</SectionLabel>
      <p className="reading">{summary}</p>
      {technologies.length ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {technologies.map((t) => (
            <Tag key={t} active>{TECHNOLOGIES[t]?.name ?? t}</Tag>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
