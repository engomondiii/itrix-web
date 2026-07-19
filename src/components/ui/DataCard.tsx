import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Card } from './Card';

export interface DataCardProps {
  label: string;
  value: ReactNode; // the numeral — the only routinely-large element
  delta?: { value: string; direction: 'up' | 'down' | 'flat' };
  hint?: string;
  featured?: boolean;
  className?: string;
}

const deltaColor = {
  up: 'text-success',
  down: 'text-error',
  flat: 'text-ink-secondary',
} as const;

/** KPI tile: uppercase micro-label, a large mono-ish numeral, optional delta. */
export function DataCard({ label, value, delta, hint, featured, className }: DataCardProps) {
  return (
    <Card variant={featured ? 'featured' : 'default'} className={cn('flex flex-col gap-1', className)}>
      <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">{label}</span>
      <span className="mt-1 text-kpi font-semibold tabular-nums text-ink-primary">{value}</span>
      {delta ? (
        <span className={cn('text-caption font-semibold', deltaColor[delta.direction])}>
          {delta.direction === 'up' ? '▲' : delta.direction === 'down' ? '▼' : '■'} {delta.value}
        </span>
      ) : null}
      {hint ? <span className="text-caption text-ink-secondary">{hint}</span> : null}
    </Card>
  );
}
