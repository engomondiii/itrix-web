import { cn } from '@/lib/cn';

export interface PatentReferenceProps {
  patentRef: string;
  label?: string;
  className?: string;
}

/** Renders a patent identifier as a quiet mono reference (e.g. P253-84KR). */
export function PatentReference({ patentRef, label = 'Patent', className }: PatentReferenceProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-caption text-ink-secondary', className)}>
      <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">{label}</span>
      <span className="font-mono text-secondary text-ink-secondary">{patentRef}</span>
    </span>
  );
}
