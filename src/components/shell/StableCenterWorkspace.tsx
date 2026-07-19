import type { ReactNode } from 'react';

export interface StableCenterWorkspaceProps {
  children: ReactNode;
  /**
   * `landing` gives the centre the full-height, vertically-centred treatment the
   * approved first screen uses. `work` is the top-aligned reading layout every
   * later state uses.
   */
  variant?: 'landing' | 'work';
  className?: string;
}

/**
 * The invariant centre.
 *
 * Everything the visitor is actually doing happens here: the composer, the
 * reflection, the pitch room, the assessment, the evidence, the customer
 * outcomes. It is the one part of the interface that never has to be relearned.
 *
 * What it must NOT become (Architecture v2.5 §11.6): a rotating marketing
 * carousel, or a dense dashboard. One dominant message, generous whitespace,
 * a reading measure capped so long text stays legible.
 *
 * The centre is protected at ≥640px on desktop no matter how wide the rails
 * grow — that guarantee lives in the shell grid (styles/shell.css), not here, so
 * it cannot be overridden by a caller.
 */
export function StableCenterWorkspace({ children, variant = 'work', className = '' }: StableCenterWorkspaceProps) {
  const base =
    variant === 'landing'
      ? 'flex min-h-[calc(100dvh-var(--shell-nav-h))] flex-col justify-center py-14'
      : 'py-10';

  return (
    <div className={`stable-center ${base} ${className}`}>
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">{children}</div>
    </div>
  );
}
