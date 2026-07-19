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
        <label htmlFor={fieldId} className="text-secondary font-medium text-ink-secondary">
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
          'w-full resize-y rounded-sm border bg-soft px-3 py-2.5 text-body text-ink-primary transition-colors placeholder:text-ink-secondary focus:outline-none focus:ring-2 focus:ring-ink-primary disabled:opacity-50',
          error ? 'border-error' : 'border-border-medium',
          className,
        )}
        {...rest}
      />
      {hint && !error ? <p id={`${fieldId}-hint`} className="text-caption text-ink-secondary">{hint}</p> : null}
      <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>
    </div>
  );
});