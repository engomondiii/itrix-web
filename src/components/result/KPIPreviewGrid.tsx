import { DataCard } from '@/components/ui/DataCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { KpiPreviewItem } from '@/types/result.types';

export function KPIPreviewGrid({ items }: { items: KpiPreviewItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>What this could mean</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <DataCard key={item.label} label={item.label} value={<span className="text-web-body">{item.metric}</span>} />
        ))}
      </div>
      <p className="text-caption text-ink-400">
        Figures are conservative and conditional — confirmed per workload through a proof-of-concept against an agreed baseline.
      </p>
    </section>
  );
}
