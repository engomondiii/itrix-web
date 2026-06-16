import { cn } from '@/lib/cn';

/**
 * The dimensional X — the reconstruction space where ALPHA Compute meets ALPHA Core.
 * Two crossing planes (sapphire + indigo) with a gold intersection node.
 */
export interface XMotifProps {
  className?: string;
  size?: number;
}

export function XMotif({ className, size = 160 }: XMotifProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 160 160" fill="none" className={cn(className)}>
      <path d="M28 28L132 132" stroke="var(--sapphire-600)" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
      <path d="M132 28L28 132" stroke="var(--indigo-800)" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
      <circle cx="80" cy="80" r="9" fill="var(--gold-500)" />
      <circle cx="80" cy="80" r="9" stroke="var(--canvas)" strokeWidth="2" />
    </svg>
  );
}
