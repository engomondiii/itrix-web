import { cn } from '@/lib/cn';

/** A boundary the workload must cross — dashed rule with a crossing node (boundary-aware motif). */
export interface BoundaryLineProps {
  className?: string;
  label?: string;
}

export function BoundaryLine({ className, label }: BoundaryLineProps) {
  return (
    <div className={cn('relative flex items-center gap-3', className)} aria-hidden>
      <span className="h-px flex-1 border-t border-dashed border-border-strong" />
      <span className="inline-flex h-2.5 w-2.5 rotate-45 items-center justify-center border border-structure-600 bg-soft" />
      {label ? <span className="text-micro font-semibold uppercase tracking-[0.1em] text-ink-secondary">{label}</span> : null}
      <span className="h-px flex-1 border-t border-dashed border-border-strong" />
    </div>
  );
}
