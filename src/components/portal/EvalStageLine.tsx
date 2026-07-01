import { cn } from '@/lib/cn';
import { EVALUATION_STAGE_LINE } from '@/config/portal.config';
import type { EvaluationStage } from '@/types/portal.types';

/** One evaluation stage row, marked done / current / upcoming (§66). */
export function EvalStageLine({ stage, state }: { stage: EvaluationStage; state: 'done' | 'current' | 'upcoming' }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className={cn(
          'mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-pill',
          state === 'done' && 'bg-tier-1',
          state === 'current' && 'bg-gold-500 ring-2 ring-gold-400/40',
          state === 'upcoming' && 'bg-line-strong',
        )}
      />
      <span className={cn('text-body', state === 'upcoming' ? 'text-ink-400' : 'text-ink-900')}>
        {EVALUATION_STAGE_LINE[stage]}
      </span>
    </li>
  );
}
