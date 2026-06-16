'use client';

import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { ErrorMessage } from './ErrorMessage';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, id, rows = 4, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={fieldId} className="text-secondary font-medium text-ink-700">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          'w-full resize-y rounded-sm border bg-surface-sunken px-3 py-2.5 text-body text-ink-900 transition-colors placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-sapphire-600 disabled:opacity-50',
          error ? 'border-error' : 'border-line',
          className,
        )}
        {...rest}
      />
      {hint && !error ? <p id={`${fieldId}-hint`} className="text-caption text-ink-400">{hint}</p> : null}
      <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>
    </div>
  );
});