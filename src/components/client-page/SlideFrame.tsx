import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { PitchDisclosure } from '@/types/client.types';

/**
 * One slide frame in the pitch room. Square-cornered, warm, print-calm. A subtle
 * disclosure marker distinguishes controlled_public slides (what can be discussed
 * only after an NDA) without ever exposing gated content.
 */
export function SlideFrame({
  index,
  total,
  title,
  disclosure,
  children,
}: {
  index: number;
  total: number;
  title: string;
  disclosure: PitchDisclosure;
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg border border-border-medium bg-surface p-6 shadow-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-caption text-ink-secondary">
          {index} / {total}
        </span>
        <span
          className={cn(
            'rounded-pill px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.08em]',
            disclosure === 'controlled_public'
              ? 'bg-soft text-structure-600'
              : 'bg-soft text-ink-primary',
          )}
        >
          {disclosure === 'controlled_public' ? 'Discussed after NDA' : 'Overview'}
        </span>
      </div>
      <h3 className="mt-3 text-web-h3 text-structure-900">{title}</h3>
      <div className="reading mt-2 text-ink-secondary">{children}</div>
    </article>
  );
}
