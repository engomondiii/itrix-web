import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { brand } from '@/constants/brand';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';

const POINTS = [
  { h: 'Thesis', d: 'Computational AI infrastructure for sustainable AI — make computation worth scaling before scaling it.' },
  { h: 'Model', d: 'Asset-light and IP-led: patented methods, licensed across hardware, cloud, and enterprise R&D.' },
  { h: 'Participation', d: 'iTrix participates in the value its methods create, rather than selling commodity compute.' },
];

export function InvestorBriefingPreview() {
  return (
    <section className="section border-b border-line bg-surface-warm">
      <div className="container-page">
        <div className="mb-6 flex items-center gap-2">
          <Badge tone="info">Investor briefing</Badge>
          <span className="text-caption text-ink-400">High-level preview</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {POINTS.map((p) => (
            <Card key={p.h} className="flex flex-col gap-2">
              <span className="text-card-title text-indigo-950">{p.h}</span>
              <span className="text-secondary text-ink-700">{p.d}</span>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-caption text-ink-400">
          Figures, projections, and the data room are shared directly by the {brand.assessmentTeam}. {NDA_WARNINGS.pricing}
        </p>
      </div>
    </section>
  );
}
