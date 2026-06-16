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
          ? 'border-sapphire-300 bg-sapphire-50'
          : 'border-line bg-surface hover:border-line-strong hover:bg-surface-warm',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] text-white',
          multi ? 'rounded-[4px]' : 'rounded-pill',
          selected ? 'border-sapphire-600 bg-sapphire-600' : 'border-line-strong bg-surface',
        )}
      >
        {selected ? '✓' : ''}
      </span>
      <span>
        <span className={cn('text-body', selected ? 'text-ink-900' : 'text-ink-700')}>{label}</span>
        {description ? <span className="block text-caption text-ink-500">{description}</span> : null}
      </span>
    </button>
  );
}
