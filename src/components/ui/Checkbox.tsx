'use client';

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <label htmlFor={fieldId} className={cn('flex cursor-pointer items-start gap-3', className)}>
      <input
        ref={ref}
        id={fieldId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-[4px] border-border-strong text-ink-primary accent-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        {...rest}
      />
      <span>
        {label ? <span className="text-body text-ink-primary">{label}</span> : null}
        {description ? <span className="block text-caption text-ink-secondary">{description}</span> : null}
      </span>
    </label>
  );
});