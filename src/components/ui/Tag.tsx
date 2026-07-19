import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Quiet metadata pill (e.g. environment, technology). Outlined, not filled. */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
}

export function Tag({ active, className, children, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-3 py-1 text-caption font-medium',
        active ? 'border-accent-soft bg-soft text-ink-primary' : 'border-border-medium text-ink-secondary',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
