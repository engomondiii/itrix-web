import { cn } from '@/lib/cn';

/** A flowing path that traces the transformation journey (representation → execution). */
export interface LightPathProps {
  className?: string;
  width?: number;
  height?: number;
}

export function LightPath({ className, width = 320, height = 80 }: LightPathProps) {
  return (
    <svg aria-hidden width={width} height={height} viewBox="0 0 320 80" fill="none" className={cn(className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id="itrix-lightpath" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--sapphire-300)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--sapphire-600)" />
          <stop offset="1" stopColor="var(--gold-500)" />
        </linearGradient>
      </defs>
      <path d="M0 60 C 80 60, 100 20, 160 20 S 240 60, 320 24" stroke="url(#itrix-lightpath)" strokeWidth="2" fill="none" />
      <circle cx="160" cy="20" r="3" fill="var(--sapphire-600)" />
      <circle cx="320" cy="24" r="3.5" fill="var(--gold-500)" />
    </svg>
  );
}
