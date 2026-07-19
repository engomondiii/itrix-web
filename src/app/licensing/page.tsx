import { LicensingHero } from '@/components/licensing/LicensingHero';
import { PathwayComparisonTable } from '@/components/licensing/PathwayComparisonTable';
import { CommercialFlowTimeline } from '@/components/licensing/CommercialFlowTimeline';
import { PaidEvaluationPackageCard } from '@/components/licensing/PaidEvaluationPackageCard';
import { LicensingCTA } from '@/components/licensing/LicensingCTA';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Licensing',
  description: 'Non-exclusive, exclusive, and strategic pathways for licensing iTrix methods.',
  path: routes.licensing,
});

export default function LicensingPage() {
  return (
    <>
      <LicensingHero
        eyebrow="Licensing"
        title="License the methods, not the hardware"
        lead="iTrix monetizes patented methods through licensing. Pathways run from standard non-exclusive use to scoped exclusivity and deep strategic partnership — all reached through evaluation, never a public price list."
      />
      <section className="section border-b border-border-medium bg-canvas">
        <div className="container-page">
          <SectionLabel>Pathways</SectionLabel>
          <div className="mt-6"><PathwayComparisonTable /></div>
        </div>
      </section>
      <CommercialFlowTimeline />
      <section className="section bg-canvas">
        <div className="container-page">
          <SectionLabel>Paid evaluation</SectionLabel>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <PaidEvaluationPackageCard
              name="Structural evaluation"
              summary="A scoped assessment of one workload against an agreed baseline."
              deliverables={['Representation diagnosis', 'Method-route recommendation', 'A conservative, validated estimate of what is possible']}
            />
            <PaidEvaluationPackageCard
              name="Proof-of-concept"
              summary="Validation of the transformed representation on your real workload."
              deliverables={['Working PoC against the baseline', 'Measured outcome with accuracy preserved', 'A clear path to license if it holds']}
              featured
            />
          </div>
        </div>
      </section>
      <LicensingCTA />
    </>
  );
}
