import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { brand } from '@/constants/brand';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';

export function MediaKitPreview() {
  return (
    <section className="section border-b border-border-medium bg-surface">
      <div className="container-page max-w-3xl">
        <Badge tone="info">For media</Badge>
        <h2 className="mt-4 text-web-h2 text-structure-900">Accurate framing</h2>

        <Card variant="sunken" className="mt-6">
          <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">One line</span>
          <p className="mt-2 text-secondary text-ink-primary">
            {brand.legalEntity} builds computational AI infrastructure that reduces the work a computation
            requires — for eligible workloads, validated case by case — rather than only running it on more hardware.
          </p>
        </Card>

        <Card variant="sunken" className="mt-4">
          <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">Paragraph</span>
          <p className="mt-2 text-secondary text-ink-secondary">
            iTrix works at the representation layer: it diagnoses how a workload is expressed in algebra and
            structure, proposes a transformed representation, and validates whether that form can run on real
            hardware. Its methods — AXIOM, CRE, and FQNM — are patented, and its numerical method is published.
          </p>
        </Card>

        <p className="mt-6 text-caption text-ink-secondary">{NDA_WARNINGS.mechanism} {NDA_WARNINGS.results}</p>
      </div>
    </section>
  );
}
