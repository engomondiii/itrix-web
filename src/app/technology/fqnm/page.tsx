import { TechnologyHero } from '@/components/technology/TechnologyHero';
import { DisclosureLevelBadge } from '@/components/technology/DisclosureLevelBadge';
import { PatentReference } from '@/components/technology/PatentReference';
import { PublicProofReference } from '@/components/technology/PublicProofReference';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { TECHNOLOGIES } from '@/constants/products';
import { routes } from '@/constants/routes';

const t = TECHNOLOGIES.fqnm;
export const metadata = buildMetadata({ title: 'FQNM', description: t.oneLiner, path: routes.fqnm });

export default function FqnmPage() {
  return (
    <>
      <TechnologyHero eyebrow={t.gap} title="FQNM" expansion={t.expansion} lead={t.oneLiner} />
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3">
            <DisclosureLevelBadge level="public" />
            <PatentReference patentRef={t.patentRef ?? ''} />
          </div>
          <SectionLabel className="mt-8">The idea</SectionLabel>
          <div className="reading mt-4">
            <p>
              FQNM runs conservation-law dynamics as exact integer transfer. Instead of accumulating
              floating-point error across steps, quantities move as counts that are conserved exactly; the
              continuum answer is reconstructed afterward. For the right problems this preserves accuracy
              while simplifying the arithmetic.
            </p>
          </div>
          <div className="mt-8">
            <PublicProofReference
              title="Fast Quantised Numerical Method"
              reference="arXiv:2604.06947"
              note="The published, citable result — the one proof point we can share without an NDA."
            />
          </div>
        </div>
      </section>
    </>
  );
}
