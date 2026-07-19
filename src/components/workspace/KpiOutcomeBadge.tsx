import { WORKSPACE_COPY } from '@/lib/content/successCopy';
import type { KpiOutcome } from '@/types/workspace.types';

/**
 * A PoC outcome badge.
 *
 *   "Evidence is transparent and no outcome is reinterpreted after the fact."
 *
 * Four things this component does on purpose:
 *
 *   1. It renders exactly the four words the type allows. There is no
 *      'promising', no 'directional', no 'partial success'. A negative result
 *      says Negative.
 *   2. Status is never colour alone — the word carries the meaning and the
 *      colour only reinforces it (Brand Manual §8.6, Surface 1 v4.0 §7.4).
 *   3. A negative result gets no softening treatment: it is rendered with the
 *      same weight and prominence as a pass.
 *   4. Semantic colour is a line and a small surface, never a large fill.
 */
const TONE: Record<KpiOutcome, string> = {
  pass: 'border-success/40 bg-success-surface text-success',
  partial: 'border-warning/40 bg-warning-surface text-warning',
  negative: 'border-error/40 bg-error-surface text-error',
  pending: 'border-border-soft bg-soft text-ink-secondary',
};

export function KpiOutcomeBadge({ outcome }: { outcome: KpiOutcome }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill border px-2.5 py-0.5 font-mono text-micro uppercase tracking-[0.08em] ${TONE[outcome]}`}
    >
      {WORKSPACE_COPY.poc.outcome[outcome]}
    </span>
  );
}
