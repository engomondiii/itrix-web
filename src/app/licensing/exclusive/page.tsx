import { LicensingHero } from '@/components/licensing/LicensingHero';
import { ExclusiveGuardrailList } from '@/components/licensing/ExclusiveGuardrailList';
import { PathwayComparisonTable } from '@/components/licensing/PathwayComparisonTable';
import { LicensingCTA } from '@/components/licensing/LicensingCTA';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { LICENSE_PATHWAYS } from '@/constants/products';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Exclusive & strategic licensing',
  description: LICENSE_PATHWAYS.exclusive.summary,
  path: routes.licensingExclusive,
});

export default function ExclusivePage() {
  return (
    <>
      <LicensingHero
        eyebrow="Licensing · Exclusive & strategic"
        title="When the advantage should be yours alone"
        lead={LICENSE_PATHWAYS.exclusive.summary}
      />
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page grid gap-8 md:grid-cols-[1.3fr_1fr]">
          <div className="reading">
            <p>
              Exclusive and strategic licensing lock a method to a single licensee within a defined field or
              region — a defensible advantage where the method is core to your product. These arrangements are
              never off-the-shelf: they are scoped to the use, granted after a successful proof-of-concept, and
              priced separately from standard licensing.
            </p>
            <p className="mt-4">
              Strategic rights go further, pairing exclusivity with co-development and milestone commitments for
              partners building deeply on the methods.
            </p>
          </div>
          <ExclusiveGuardrailList />
        </div>
      </section>
      <section className="section bg-canvas">
        <div className="container-page">
          <SectionLabel>How the pathways compare</SectionLabel>
          <div className="mt-6"><PathwayComparisonTable /></div>
        </div>
      </section>
      <LicensingCTA />
    </>
  );
}
