'use client';

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ErrorMessage } from './ErrorMessage';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
}

const fieldBase =
  'w-full rounded-sm border bg-surface-sunken px-3 text-body text-ink-900 transition-colors ' +
  'placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-sapphire-600 focus:ring-offset-0 disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leadingIcon, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-secondary font-medium text-ink-700">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leadingIcon ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{leadingIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(fieldBase, 'h-10', leadingIcon ? 'pl-9' : '', error ? 'border-error' : 'border-line', className)}
          {...rest}
        />
      </div>
      {hint && !error ? <p id={`${inputId}-hint`} className="text-caption text-ink-400">{hint}</p> : null}
      <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>
    </div>
  );
});