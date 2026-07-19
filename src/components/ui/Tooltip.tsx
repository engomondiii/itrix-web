'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}

/** Lightweight hover/focus tooltip. Indigo chip on the warm canvas. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      <span aria-describedby={open ? id : undefined}>{children}</span>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className={cn(
            'pointer-events-none absolute left-1/2 z-50 w-max max-w-xs -translate-x-1/2 rounded-sm bg-structure-900 px-2.5 py-1.5 text-caption text-ink-inverse shadow-2 animate-fade-in',
            side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            className,
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
