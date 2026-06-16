import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { buildMetadata } from '@/components/seo/PageMeta';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Resources',
  description: 'Public references and reading on the methods behind iTrix.',
  path: routes.resources,
});

const RESOURCES = [
  { title: 'FQNM paper', desc: 'The published Fast Quantised Numerical Method (arXiv:2604.06947).', href: routes.fqnmPaper, tone: 'success' as const, badge: 'Public' },
  { title: 'Technology overview', desc: 'The unified representation-to-reconstruction view and the three methods.', href: routes.technology, tone: 'info' as const, badge: 'Public' },
];

export default function ResourcesPage() {
  return (
    <PageWrapper eyebrow="Resources" title="Public references" lead="What we can share openly. Mechanism detail and benchmarks open up under NDA.">
      <div className="grid gap-4 md:grid-cols-2">
        {RESOURCES.map((r) => (
          <Link key={r.title} href={r.href} className="block h-full">
            <Card variant="default" interactive className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-card-title text-indigo-950">{r.title}</h3>
                <Badge tone={r.tone}>{r.badge}</Badge>
              </div>
              <p className="text-secondary text-ink-500">{r.desc}</p>
              <span className="mt-auto pt-2 text-secondary text-sapphire-600">Open →</span>
            </Card>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
