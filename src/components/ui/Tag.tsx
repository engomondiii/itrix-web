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
        active ? 'border-sapphire-300 bg-sapphire-50 text-sapphire-700' : 'border-line text-ink-500',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
