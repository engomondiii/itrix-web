import { cn } from '@/lib/cn';

/** Faint square coordinate grid behind heroes / structural sections (the grid motif). */
export interface BackgroundGridProps {
  className?: string;
  size?: number; // px per cell
  fade?: boolean;
}

export function BackgroundGrid({ className, size = 48, fade = true }: BackgroundGridProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10', fade && 'grid-paper-fade', className)}
      style={{
        backgroundImage:
          'linear-gradient(to right, var(--border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)',
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
