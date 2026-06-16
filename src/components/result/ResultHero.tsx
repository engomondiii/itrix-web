import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { tierLabel, tierTone, tierSla } from '@/lib/formatting/formatTier';
import { formatScore } from '@/lib/formatting/formatScore';
import type { LeadTier } from '@/types/lead.types';

export interface ResultHeroProps {
  tier: LeadTier;
  totalScore: number;
}

export function ResultHero({ tier, totalScore }: ResultHeroProps) {
  return (
    <section className="border-b border-line bg-canvas">
      <div className="py-8">
        <SectionLabel>Your structural read</SectionLabel>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-web-h1 text-indigo-950">Here’s what we see.</h1>
            <p className="mt-2 flex items-center gap-2 text-secondary text-ink-500">
              Assessment tier <Badge tone={tierTone(tier)}>{tierLabel(tier)}</Badge>
              <span className="text-ink-400">· {tierSla(tier)}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="block text-micro font-semibold uppercase tracking-[0.06em] text-ink-400">Fit signal</span>
            <span className="text-kpi font-semibold tabular-nums text-indigo-950">{formatScore(totalScore)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
