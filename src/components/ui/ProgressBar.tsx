import { cn } from '@/lib/cn';

export interface ProgressBarProps {
  value: number; // 0..100
  className?: string;
  tone?: 'sapphire' | 'gold' | 'success';
  showLabel?: boolean;
}

const toneVar = { sapphire: 'var(--ink-primary)', gold: 'var(--accent)', success: 'var(--success-600)' } as const;

export function ProgressBar({ value, className, tone = 'sapphire', showLabel }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-soft" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-pill transition-[width] duration-base ease-out" style={{ width: `${clamped}%`, backgroundColor: toneVar[tone] }} />
      </div>
      {showLabel ? <span className="w-10 text-right text-caption tabular-nums text-ink-secondary">{Math.round(clamped)}%</span> : null}
    </div>
  );
}
