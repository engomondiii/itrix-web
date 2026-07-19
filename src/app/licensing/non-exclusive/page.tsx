import { LicensingHero } from '@/components/licensing/LicensingHero';
import { CommercialFlowTimeline } from '@/components/licensing/CommercialFlowTimeline';
import { LicensingCTA } from '@/components/licensing/LicensingCTA';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { LICENSE_PATHWAYS } from '@/constants/products';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Non-exclusive licensing',
  description: LICENSE_PATHWAYS.non_exclusive.summary,
  path: routes.licensingNonExclusive,
});

export default function NonExclusivePage() {
  return (
    <>
      <LicensingHero
        eyebrow="Licensing · Non-exclusive"
        title="The default pathway"
        lead={LICENSE_PATHWAYS.non_exclusive.summary}
      />
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page max-w-3xl">
          <SectionLabel>What it means</SectionLabel>
          <div className="reading mt-4">
            <p>
              Non-exclusive licensing is how most organizations adopt iTrix methods: standard terms, open to
              multiple licensees, scoped to your use. It is the fastest route from a validated proof-of-concept
              to production use, without the commitments that exclusivity carries.
            </p>
          </div>
          <Card variant="sunken" className="mt-6">
            <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">Good fit when</span>
            <p className="mt-2 text-secondary text-ink-secondary">
              You want the advantage in your own stack, you don't need to lock competitors out of the method,
              and you value speed and standard terms over bespoke arrangements.
            </p>
          </Card>
        </div>
      </section>
      <CommercialFlowTimeline />
      <LicensingCTA />
    </>
  );
}
