import { cn } from '@/lib/cn';
import { POC_MILESTONE_LINE } from '@/config/portal.config';
import type { PoCMilestone } from '@/types/portal.types';

/** One PoC milestone row, marked done / current / upcoming (§67). */
export function PoCMilestoneLine({ milestone, state }: { milestone: PoCMilestone; state: 'done' | 'current' | 'upcoming' }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className={cn(
          'mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-pill',
          state === 'done' && 'bg-tier-1',
          state === 'current' && 'bg-accent ring-2 ring-accent-soft/40',
          state === 'upcoming' && 'bg-border-strong',
        )}
      />
      <span className={cn('text-body', state === 'upcoming' ? 'text-ink-secondary' : 'text-ink-primary')}>
        {POC_MILESTONE_LINE[milestone]}
      </span>
    </li>
  );
}
