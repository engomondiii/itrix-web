import { LICENSE_PATHWAYS } from '@/constants/products';
import { Badge } from '@/components/ui/Badge';

const ORDER = ['non_exclusive', 'exclusive', 'strategic'] as const;
const ROWS: { dim: string; values: Record<(typeof ORDER)[number], string> }[] = [
  { dim: 'Who can license', values: { non_exclusive: 'Multiple licensees', exclusive: 'One, within a defined field or region', strategic: 'A single strategic partner' } },
  { dim: 'Best for', values: { non_exclusive: 'Standard product adoption', exclusive: 'Defensible advantage in a domain', strategic: 'Deep, long-term co-development' } },
  { dim: 'Terms', values: { non_exclusive: 'Standard', exclusive: 'Scoped and priced case by case', strategic: 'Bespoke, with strategic rights' } },
];

export function PathwayComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-medium">
      <table className="w-full min-w-[680px] border-collapse bg-surface text-left">
        <thead>
          <tr className="bg-soft text-caption text-ink-secondary">
            <th className="px-4 py-3 font-semibold"> </th>
            {ORDER.map((k) => (
              <th key={k} className="px-4 py-3 font-semibold">
                <span className="flex items-center gap-2">
                  {LICENSE_PATHWAYS[k].label}
                  {k === 'exclusive' || k === 'strategic' ? <Badge tone="special">Premium</Badge> : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.dim} className="border-t border-border-soft align-top">
              <td className="px-4 py-4 text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">{r.dim}</td>
              {ORDER.map((k) => (
                <td key={k} className="px-4 py-4 text-secondary text-ink-secondary">{r.values[k]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
