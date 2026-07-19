'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { usePressureSignal } from '@/hooks/usePressureSignal';
import { cn } from '@/lib/cn';

/**
 * Pressure signal cards (Playbook §10). The intro line and card wording come from
 * the updated PRESSURE_SIGNALS (review.config), phrased in the visitor's voice
 * ("Computation is becoming too expensive", "Our workload is too slow", …).
 */
export function PressureSignalCards() {
  const { signals, isSelected, toggle } = usePressureSignal();
  return (
    <div className="flex flex-col gap-3">
      <SectionLabel withRule={false}>If useful, begin from one of these pressures</SectionLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        {signals.map((s) => {
          const selected = isSelected(s.area);
          return (
            <button
              key={s.area}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(s.area)}
              className={cn(
                'rounded-md border px-4 py-3 text-left transition-colors',
                selected
                  ? 'border-accent-soft bg-soft'
                  : 'border-border-medium bg-surface hover:border-border-strong hover:bg-surface',
              )}
            >
              <span className={cn('block text-secondary font-medium', selected ? 'text-ink-primary' : 'text-ink-primary')}>
                {s.prompt}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
