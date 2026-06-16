import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { routes } from '@/constants/routes';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';

const ITEMS = [
  { h: 'Published method', d: 'FQNM — the Fast Quantised Numerical Method — is published and citable.', tone: 'success' as const },
  { h: 'Validation', d: 'Results are stated conditionally and confirmed through proof-of-concept against agreed baselines.', tone: 'info' as const },
  { h: 'Collaboration', d: 'Research collaboration is welcome where it can be validated and published responsibly.', tone: 'info' as const },
];

export function ResearchRoomContent() {
  return (
    <section className="section border-b border-line bg-surface-warm">
      <div className="container-page">
        <div className="grid gap-4 md:grid-cols-3">
          {ITEMS.map((it) => (
            <Card key={it.h} className="flex flex-col gap-2">
              <Badge tone={it.tone}>{it.h}</Badge>
              <span className="text-secondary text-ink-700">{it.d}</span>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-caption text-ink-400">{NDA_WARNINGS.benchmarks}</p>
        <Link href={routes.fqnmPaper} className="mt-2 inline-block text-secondary text-sapphire-600 underline-offset-2 hover:underline">
          Read the FQNM paper →
        </Link>
      </div>
    </section>
  );
}
