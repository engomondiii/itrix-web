import { cn } from '@/lib/cn';

type Shape = 'square' | 'cross' | 'corner';

/** A small geometric accent (square / plus / corner bracket) for section corners. */
export interface GeometricAccentProps {
  shape?: Shape;
  className?: string;
  size?: number;
}

export function GeometricAccent({ shape = 'square', className, size = 24 }: GeometricAccentProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('text-structure-600', className)}>
      {shape === 'square' && <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" />}
      {shape === 'cross' && (
        <>
          <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {shape === 'corner' && <path d="M4 10V4h6M20 14v6h-6" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}
