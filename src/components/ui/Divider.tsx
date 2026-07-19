import { cn } from '@/lib/cn';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  /** A thin gold rule for section heads (used sparingly). */
  accent?: boolean;
}

export function Divider({ orientation = 'horizontal', accent, className }: DividerProps) {
  if (orientation === 'vertical') {
    return <span role="separator" aria-orientation="vertical" className={cn('inline-block w-px self-stretch bg-border-medium', accent && 'bg-accent', className)} />;
  }
  return <hr className={cn('border-0 border-t', accent ? 'border-accent' : 'border-border-medium', className)} />;
}
