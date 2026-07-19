'use client';

import { cn } from '@/lib/cn';

export interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  multi?: boolean;
  onSelect: () => void;
}

export function OptionCard({ label, description, selected, multi, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors',
        selected
          ? 'border-accent-soft bg-soft'
          : 'border-border-medium bg-surface hover:border-border-strong hover:bg-surface',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] text-white',
          multi ? 'rounded-[4px]' : 'rounded-pill',
          selected ? 'border-ink-primary bg-ink-primary' : 'border-border-strong bg-surface',
        )}
      >
        {selected ? '✓' : ''}
      </span>
      <span>
        <span className={cn('text-body', selected ? 'text-ink-primary' : 'text-ink-secondary')}>{label}</span>
        {description ? <span className="block text-caption text-ink-secondary">{description}</span> : null}
      </span>
    </button>
  );
}
