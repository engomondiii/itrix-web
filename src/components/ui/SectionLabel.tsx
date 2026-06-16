import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'default' | 'gold' | 'error';

const toneClass: Record<Tone, string> = {
  default: 'text-sapphire-600',
  gold: 'text-gold-600',
  error: 'text-error-text',
};

/** Uppercase eyebrow label with a short leading rule. Encodes section, not decoration. */
export interface SectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  withRule?: boolean;
}

export function SectionLabel({ tone = 'default', withRule = true, className, children, ...rest }: SectionLabelProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-micro font-semibold uppercase tracking-[0.1em]', toneClass[tone], className)} {...rest}>
      {withRule ? <span aria-hidden className="h-px w-6 bg-current opacity-50" /> : null}
      {children}
    </span>
  );
}
