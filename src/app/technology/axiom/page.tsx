import { TechnologyHero } from '@/components/technology/TechnologyHero';
import { DisclosureLevelBadge } from '@/components/technology/DisclosureLevelBadge';
import { PatentReference } from '@/components/technology/PatentReference';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { TECHNOLOGIES } from '@/constants/products';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';
import { routes } from '@/constants/routes';

const t = TECHNOLOGIES.axiom;
export const metadata = buildMetadata({ title: 'AXIOM', description: t.oneLiner, path: routes.axiom });

export default function AxiomPage() {
  return (
    <>
      <TechnologyHero eyebrow={t.gap} title="AXIOM" expansion={t.expansion} lead={t.oneLiner} />
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3">
            <DisclosureLevelBadge level="controlled_public" />
            <PatentReference patentRef={t.patentRef ?? ''} />
          </div>
          <SectionLabel className="mt-8">The idea</SectionLabel>
          <div className="reading mt-4">
            <p>
              AXIOM treats a computation as an <strong>algebraic state</strong>. The state evolves through
              transitions; what you measure is a <em>projection</em> of that state, not the whole of it. The
              key consequence is simple and easy to get wrong: a zero observation does not mean a zero state.
              Information you can't see can still be preserved, carried forward, and reconstructed later.
            </p>
            <p className="mt-4">
              Designing around this — preserving hidden state through transition and projection — is what lets
              downstream methods avoid redundant work and recover exact answers. It is the representation
              discipline the rest of the pipeline depends on.
            </p>
          </div>
          <Card variant="sunken" className="mt-8">
            <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">Public boundary</span>
            <p className="mt-2 text-secondary text-ink-secondary">{NDA_WARNINGS.mechanism}</p>
          </Card>
        </div>
      </section>
    </>
  );
}
