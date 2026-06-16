import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DisclosureLevelBadge } from '@/components/technology/DisclosureLevelBadge';
import type { ProofPreviewItem } from '@/types/result.types';

export function ProofPreviewSection({ items }: { items: ProofPreviewItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>Proof</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.title} variant={item.disclosure === 'public' ? 'default' : 'sunken'} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-card-title text-ink-900">{item.title}</span>
              <DisclosureLevelBadge level={item.disclosure} />
            </div>
            {item.disclosure === 'public' && item.reference ? (
              <span className="font-mono text-secondary text-sapphire-700">{item.reference}</span>
            ) : (
              <span className="text-caption text-ink-500">Shared under NDA, validated per workload.</span>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
