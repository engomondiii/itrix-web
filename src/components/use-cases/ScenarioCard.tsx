import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import type { UseCase } from '@/lib/content/useCases';

/** A use-case summary card for the Use Cases index. */
export function ScenarioCard({ useCase }: { useCase: UseCase }) {
  return (
    <Link href={`/use-cases/${useCase.slug}`} className="group block">
      <Card variant="default" interactive className="flex h-full flex-col gap-2">
        <span className="text-micro font-semibold uppercase tracking-[0.1em] text-ink-primary">
          {useCase.audience}
        </span>
        <h3 className="text-web-h3 text-structure-900 group-hover:text-ink-primary">{useCase.headline}</h3>
        <p className="text-secondary text-ink-secondary line-clamp-3">{useCase.situation}</p>
        <span className="mt-auto pt-2 text-secondary font-medium text-ink-primary">Read this scenario →</span>
      </Card>
    </Link>
  );
}
