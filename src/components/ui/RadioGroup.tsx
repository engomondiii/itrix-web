'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ErrorMessage } from './ErrorMessage';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface RadioGroupProps {
  name?: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

/** Card-style radio group — each option is a selectable card (used in the review flow). */
export function RadioGroup({ name, label, options, value, onChange, error, className }: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;

  return (
    <fieldset className={cn('flex flex-col gap-2', className)} aria-invalid={!!error}>
      {label ? <legend className="mb-1 text-secondary font-medium text-ink-700">{label}</legend> : null}
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <label
            key={o.value}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors',
              selected ? 'border-sapphire-300 bg-sapphire-50' : 'border-line bg-surface hover:border-line-strong hover:bg-surface-warm',
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={o.value}
              checked={selected}
              onChange={() => onChange?.(o.value)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-sapphire-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            />
            <span>
              <span className={cn('text-body', selected ? 'text-ink-900' : 'text-ink-700')}>{o.label}</span>
              {o.description ? <span className="block text-caption text-ink-500">{o.description}</span> : null}
            </span>
          </label>
        );
      })}
      <ErrorMessage>{error}</ErrorMessage>
    </fieldset>
  );
}
