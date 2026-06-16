import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'default' | 'warm' | 'sunken' | 'featured';

const variants: Record<Variant, string> = {
  default: 'bg-surface border border-line shadow-1',
  warm: 'bg-surface-warm border border-line shadow-1',
  sunken: 'bg-surface-sunken border border-line-subtle',
  featured: 'bg-surface border border-gold-400 shadow-gold',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padded?: boolean;
  interactive?: boolean;
}

export function Card({ variant = 'default', padded = true, interactive, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md',
        variants[variant],
        padded && 'p-5',
        interactive && 'transition-shadow duration-base ease-out hover:shadow-2',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-card-title text-ink-700', className)} {...rest}>
      {children}
    </h3>
  );
}
