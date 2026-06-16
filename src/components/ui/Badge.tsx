import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone =
  | 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'special'
  | 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4';

const toneStyle: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--surface-sunken)', fg: 'var(--ink-700)' },
  info: { bg: 'var(--sapphire-100)', fg: 'var(--sapphire-700)' },
  success: { bg: 'var(--success-soft)', fg: 'var(--success-text)' },
  warning: { bg: 'var(--warning-soft)', fg: 'var(--warning-text)' },
  error: { bg: 'var(--error-soft)', fg: 'var(--error-text)' },
  special: { bg: 'var(--gold-100)', fg: 'var(--gold-600)' },
  'tier-1': { bg: 'var(--tier-1-soft)', fg: 'var(--tier-1)' },
  'tier-2': { bg: 'var(--tier-2-soft)', fg: 'var(--tier-2)' },
  'tier-3': { bg: 'var(--tier-3-soft)', fg: 'var(--tier-3)' },
  'tier-4': { bg: 'var(--tier-4-soft)', fg: 'var(--tier-4)' },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: ReactNode;
}

/** The signature pattern: always soft background + strong text, never a solid block. */
export function Badge({ tone = 'neutral', icon, className, children, style, ...rest }: BadgeProps) {
  const { bg, fg } = toneStyle[tone];
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-sm font-medium whitespace-nowrap text-[12px] leading-none px-2 py-[3px]', className)}
      style={{ backgroundColor: bg, color: fg, ...style }}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
