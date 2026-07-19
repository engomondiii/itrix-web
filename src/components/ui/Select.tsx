'use client';

import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { ErrorMessage } from './ErrorMessage';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, placeholder, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={fieldId} className="text-secondary font-medium text-ink-secondary">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'h-10 w-full appearance-none rounded-sm border bg-soft pl-3 pr-9 text-body text-ink-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ink-primary disabled:opacity-50',
            error ? 'border-error' : 'border-border-medium',
            className,
          )}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary">▾</span>
      </div>
      {hint && !error ? <p id={`${fieldId}-hint`} className="text-caption text-ink-secondary">{hint}</p> : null}
      <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>
    </div>
  );
});