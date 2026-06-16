import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';

const GUARDRAILS = [
  'Exclusivity is granted only after a successful proof-of-concept.',
  'Scope is bounded — by field, region, or application — not blanket.',
  'Exclusive and strategic rights are priced separately from standard licensing.',
  'Option and exclusivity fees are never presented as standard pricing.',
  'Strategic rights carry co-development and milestone commitments.',
];

export function ExclusiveGuardrailList() {
  return (
    <Card variant="default" className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge tone="special">Exclusive & strategic</Badge>
        <span className="text-card-title text-ink-900">Guardrails</span>
      </div>
      <ul className="flex flex-col gap-2">
        {GUARDRAILS.map((g) => (
          <li key={g} className="flex items-start gap-2 text-secondary text-ink-700">
            <span aria-hidden className="mt-1 text-gold-500">◆</span>
            <span>{g}</span>
          </li>
        ))}
      </ul>
      <p className="border-t border-line-subtle pt-3 text-caption text-ink-400">{NDA_WARNINGS.exclusivity}</p>
    </Card>
  );
}
