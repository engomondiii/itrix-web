import { cn } from '@/lib/cn';

type Status = 'online' | 'success' | 'warning' | 'error' | 'idle';

const colorVar: Record<Status, string> = {
  online: 'var(--success-600)',
  success: 'var(--success-600)',
  warning: 'var(--warning-600)',
  error: 'var(--error-600)',
  idle: 'var(--ink-muted)',
};

export interface StatusDotProps {
  status: Status;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ status, label, pulse, className }: StatusDotProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative inline-flex h-2 w-2">
        {pulse ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-pill opacity-60" style={{ backgroundColor: colorVar[status] }} />
        ) : null}
        <span className="relative inline-flex h-2 w-2 rounded-pill" style={{ backgroundColor: colorVar[status] }} />
      </span>
      {label ? <span className="text-caption text-ink-secondary">{label}</span> : null}
    </span>
  );
}
