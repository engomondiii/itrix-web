'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { usePressureSignal } from '@/hooks/usePressureSignal';
import { cn } from '@/lib/cn';

export function PressureSignalCards() {
  const { signals, isSelected, toggle } = usePressureSignal();
  return (
    <div className="flex flex-col gap-3">
      <SectionLabel withRule={false}>What’s becoming the limit?</SectionLabel>
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
                selected ? 'border-sapphire-300 bg-sapphire-50' : 'border-line bg-surface hover:border-line-strong hover:bg-surface-warm',
              )}
            >
              <span className={cn('block text-secondary font-medium', selected ? 'text-sapphire-700' : 'text-ink-900')}>{s.label}</span>
              <span className="block text-caption text-ink-500">{s.prompt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
