import { cn } from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg';
const sizeClass: Record<Size, string> = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-9 w-9 border-[3px]' };

export interface SpinnerProps {
  size?: Size;
  className?: string;
  label?: string;
}

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block animate-spin rounded-pill border-line-strong border-t-sapphire-600', sizeClass[size], className)}
    />
  );
}
