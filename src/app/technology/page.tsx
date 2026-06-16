import { TechnologyHero } from '@/components/technology/TechnologyHero';
import { UnifiedViewDiagram } from '@/components/technology/UnifiedViewDiagram';
import { TechnologyComparisonTable } from '@/components/technology/TechnologyComparisonTable';
import { TechnologyCard } from '@/components/technology/TechnologyCard';
import { PublicProofReference } from '@/components/technology/PublicProofReference';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { TECHNOLOGIES } from '@/constants/products';
import { routes } from '@/constants/routes';
import Link from 'next/link';

export const metadata = buildMetadata({
  title: 'Technology',
  description: 'AXIOM, CRE, and FQNM — the unified representation-to-reconstruction view behind iTrix.',
  path: routes.technology,
});

export default function TechnologyPage() {
  return (
    <>
      <TechnologyHero
        eyebrow="Technology"
        title="One pipeline, three methods"
        lead="Every iTrix method serves a single chain: represent the problem, observe what matters, transfer what's conserved, execute against real hardware, and reconstruct the answer. Here is the public view."
      />
      <section className="section border-b border-line bg-surface-warm">
        <div className="container-page">
          <SectionLabel>The unified view</SectionLabel>
          <div className="mt-6"><UnifiedViewDiagram /></div>
        </div>
      </section>
      <section className="section border-b border-line bg-canvas">
        <div className="container-page">
          <SectionLabel>The three methods</SectionLabel>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <TechnologyCard tech={TECHNOLOGIES.axiom} href={routes.axiom} />
            <TechnologyCard tech={TECHNOLOGIES.cre} href={routes.cre} />
            <TechnologyCard tech={TECHNOLOGIES.fqnm} href={routes.fqnm} />
          </div>
          <div className="mt-8"><TechnologyComparisonTable /></div>
        </div>
      </section>
      <section className="section bg-surface-warm">
        <div className="container-page max-w-3xl">
          <SectionLabel>The public proof point</SectionLabel>
          <div className="mt-6">
            <PublicProofReference
              title="Fast Quantised Numerical Method (FQNM)"
              reference="arXiv:2604.06947"
              note="Exact integer-transfer dynamics for conservation-law workloads, with continuum reconstruction."
            />
          </div>
          <div className="mt-8">
            <Link href={routes.review}><Button variant="primary" size="lg">Begin a compute bottleneck review</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
