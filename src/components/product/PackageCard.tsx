import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';

export interface PackageCardProps {
  name: string;
  summary: string;
  includes: string[];
  featured?: boolean;
}

/** An engagement / evaluation package. Never shows a price — terms are handled by the team. */
export function PackageCard({ name, summary, includes, featured }: PackageCardProps) {
  return (
    <Card variant={featured ? 'featured' : 'default'} className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-web-h3 text-structure-900">{name}</h3>
        {featured ? <Badge tone="special">Most scoped</Badge> : null}
      </div>
      <p className="text-secondary text-ink-secondary">{summary}</p>
      <ul className="flex flex-col gap-2">
        {includes.map((item) => (
          <li key={item} className="flex items-start gap-2 text-secondary text-ink-secondary">
            <span aria-hidden className="mt-1 text-ink-primary">▪</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto border-t border-border-soft pt-3 text-caption text-ink-secondary">{NDA_WARNINGS.pricing}</p>
    </Card>
  );
}
