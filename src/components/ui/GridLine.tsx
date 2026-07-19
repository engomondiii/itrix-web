import { cn } from '@/lib/cn';

/**
 * A single hairline structural rule (the "structure is information" motif).
 * Horizontal or vertical; optional label sitting on the line.
 */
export interface GridLineProps {
  direction?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export function GridLine({ direction = 'horizontal', label, className }: GridLineProps) {
  if (direction === 'vertical') {
    return <span aria-hidden className={cn('block w-px bg-border-soft', className)} />;
  }
  return (
    <div className={cn('relative flex items-center', className)} aria-hidden>
      <span className="h-px flex-1 bg-border-soft" />
      {label ? (
        <span className="px-3 text-micro font-semibold uppercase tracking-[0.1em] text-ink-secondary">{label}</span>
      ) : null}
      {label ? <span className="h-px flex-1 bg-border-soft" /> : null}
    </div>
  );
}
