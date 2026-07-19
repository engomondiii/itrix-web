import { cn } from '@/lib/cn';

/** A quiet x/y coordinate axis mark — geometry as structure, not decoration. */
export interface CoordinateAxisProps {
  className?: string;
  size?: number;
}

export function CoordinateAxis({ className, size = 120 }: CoordinateAxisProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 120 120" fill="none" className={cn('text-border-strong', className)}>
      <line x1="12" y1="108" x2="108" y2="108" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="108" x2="12" y2="12" stroke="currentColor" strokeWidth="1" />
      <path d="M108 108l-6-3v6z" fill="currentColor" />
      <path d="M12 12l-3 6h6z" fill="currentColor" />
      <circle cx="40" cy="76" r="2.5" fill="var(--ink-primary)" />
      <circle cx="68" cy="52" r="2.5" fill="var(--ink-primary)" />
      <circle cx="92" cy="34" r="2.5" fill="var(--accent)" />
    </svg>
  );
}
