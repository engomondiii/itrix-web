import { cn } from '@/lib/cn';

/** A calm transition between full-bleed sections — a centered rule with a node. */
export interface SectionTransitionProps {
  className?: string;
  tone?: 'sapphire' | 'gold';
}

export function SectionTransition({ className, tone = 'sapphire' }: SectionTransitionProps) {
  const color = tone === 'gold' ? 'var(--accent)' : 'var(--ink-primary)';
  return (
    <div className={cn('container-page flex items-center gap-4 py-2', className)} aria-hidden>
      <span className="h-px flex-1 bg-border-medium" />
      <span className="inline-flex h-1.5 w-1.5 rounded-pill" style={{ backgroundColor: color }} />
      <span className="h-px flex-1 bg-border-medium" />
    </div>
  );
}
