import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PRODUCTS } from '@/constants/products';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';

const PATHS = [
  { h: 'Integration', d: `${PRODUCTS.alpha_core.name} embeds into hardware and runtime backends as licensed IP.` },
  { h: 'Co-development', d: 'Joint work to adapt the methods to a partner platform, scoped after evaluation.' },
  { h: 'Strategic rights', d: 'Field or regional exclusivity for partners who commit to deep integration.' },
];

export function PartnershipRoomContent() {
  return (
    <section className="section border-b border-border-medium bg-surface">
      <div className="container-page">
        <Badge tone="special">Partnership</Badge>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PATHS.map((p) => (
            <Card key={p.h} className="flex flex-col gap-2">
              <span className="text-card-title text-structure-900">{p.h}</span>
              <span className="text-secondary text-ink-secondary">{p.d}</span>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-caption text-ink-secondary">{NDA_WARNINGS.exclusivity}</p>
      </div>
    </section>
  );
}
