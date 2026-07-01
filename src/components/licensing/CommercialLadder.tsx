import { SectionLabel } from '@/components/ui/SectionLabel';
import { cn } from '@/lib/cn';

/**
 * The named staged commercial ladder (Playbook §00E). Shown publicly as the honest
 * shape of the pathway — the first paid step named is the Assessment; Optimizer/SDK
 * stay internal and no fee is shown. It is orientation, not a funnel push.
 */
interface Rung {
  label: string;
  detail: string;
  paid?: boolean;
}

const RUNGS: Rung[] = [
  { label: 'Compute Bottleneck Review', detail: 'Free. A structural read on your workload — no quote, no sales call.' },
  { label: 'Confidential conversation & NDA', detail: 'A private technical briefing once an NDA is in place.' },
  { label: 'Alpha Compute Assessment', detail: 'Paid. A Boundary Waste Map of one workload.', paid: true },
  { label: 'Proof of concept', detail: 'Paid. A hands-on test against success criteria agreed up front.', paid: true },
  { label: 'Integration', detail: 'ALPHA Core integration where the evaluation supports it.' },
  { label: 'License', detail: 'License-out — non-exclusive, or exclusive for selected strategic partners.' },
];

export function CommercialLadder({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <SectionLabel>The commercial pathway</SectionLabel>
      <ol className="flex flex-col gap-3">
        {RUNGS.map((rung, i) => (
          <li key={rung.label} className="flex items-start gap-4">
            <span
              aria-hidden
              className={cn(
                'mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-micro font-semibold',
                rung.paid ? 'bg-gold-500 text-indigo-950' : 'bg-sapphire-50 text-sapphire-700',
              )}
            >
              {i + 1}
            </span>
            <div className="flex flex-col">
              <span className="text-body font-medium text-ink-900">
                {rung.label}
                {rung.paid ? <span className="ml-2 text-micro font-semibold uppercase tracking-[0.08em] text-gold-600">Paid</span> : null}
              </span>
              <span className="text-secondary text-ink-500">{rung.detail}</span>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-caption text-ink-400">
        Exclusive arrangements exist for selected strategic partners and are discussed privately. No fees are shown here.
      </p>
    </div>
  );
}
