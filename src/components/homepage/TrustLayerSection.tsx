import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { APPROVED_CLAIM_FRAMING } from '@/constants/disclosure';
import { TECHNOLOGIES } from '@/constants/products';
import { routes } from '@/constants/routes';

export function TrustLayerSection() {
  return (
    <section className="section border-b border-line bg-surface-warm">
      <div className="container-page">
        <SectionLabel>Why it holds up</SectionLabel>
        <h2 className="mt-4 max-w-2xl text-web-h2 text-indigo-950">Conservative claims, patented methods, published proof.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card className="flex flex-col gap-3">
            <Badge tone="info">Claims discipline</Badge>
            <p className="text-secondary text-ink-700">
              We describe results as {APPROVED_CLAIM_FRAMING.conservative} — always {APPROVED_CLAIM_FRAMING.validation}.
            </p>
          </Card>
          <Card className="flex flex-col gap-3">
            <Badge tone="special">Patented methods</Badge>
            <p className="text-secondary text-ink-700">
              The core methods are protected: AXIOM ({TECHNOLOGIES.axiom.patentRef}), CRE ({TECHNOLOGIES.cre.patentRef}),
              and FQNM ({TECHNOLOGIES.fqnm.patentRef}).
            </p>
          </Card>
          <Card className="flex flex-col gap-3">
            <Badge tone="success">Published proof</Badge>
            <p className="text-secondary text-ink-700">
              FQNM is published and citable.{' '}
              <Link href={routes.fqnmPaper} className="text-sapphire-600 underline-offset-2 hover:underline">
                Read the paper
              </Link>
              .
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
