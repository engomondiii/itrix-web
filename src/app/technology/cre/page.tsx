import { TechnologyHero } from '@/components/technology/TechnologyHero';
import { DisclosureLevelBadge } from '@/components/technology/DisclosureLevelBadge';
import { PatentReference } from '@/components/technology/PatentReference';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { TECHNOLOGIES } from '@/constants/products';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';
import { routes } from '@/constants/routes';

const t = TECHNOLOGIES.cre;
export const metadata = buildMetadata({ title: 'CRE', description: t.oneLiner, path: routes.cre });

export default function CrePage() {
  return (
    <>
      <TechnologyHero eyebrow={t.gap} title="CRE" expansion={t.expansion} lead={t.oneLiner} />
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3">
            <DisclosureLevelBadge level="controlled_public" />
            <PatentReference patentRef={t.patentRef ?? ''} />
          </div>
          <SectionLabel className="mt-8">The idea</SectionLabel>
          <div className="reading mt-4">
            <p>
              CRE — Conjugation–Real Embedding — gives selected complex and tensor operator workloads a
              structure-preserving representation in real arithmetic. The point is fidelity: spectra, norms,
              and conditioning are retained, so the embedded form behaves like the original rather than an
              approximation of it.
            </p>
            <p className="mt-4">
              Where it applies, working in this real embedding can reduce arithmetic — conservatively, on the
              order of a few times, for eligible workloads and always confirmed by proof-of-concept.
            </p>
          </div>
          <Card variant="sunken" className="mt-8">
            <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">Public boundary</span>
            <p className="mt-2 text-secondary text-ink-secondary">{NDA_WARNINGS.benchmarks}</p>
          </Card>
        </div>
      </section>
    </>
  );
}
