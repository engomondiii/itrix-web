import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Inline form/field error. Direct, never apologetic (design skill: errors don't apologize). */
export interface ErrorMessageProps {
  children?: ReactNode;
  id?: string;
  className?: string;
}

export function ErrorMessage({ children, id, className }: ErrorMessageProps) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className={cn('mt-1 flex items-start gap-1 text-caption text-error-text', className)}>
      <span aria-hidden className="leading-none">•</span>
      <span>{children}</span>
    </p>
  );
}
