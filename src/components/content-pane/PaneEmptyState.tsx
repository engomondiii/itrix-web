'use client';

import { PANE_COPY } from '@/lib/content/paneCopy';

/**
 * The pane with nothing in it yet.
 *
 * A SENTENCE, not a decorative panel. A visitor whose conversation has produced
 * nothing does not need an illustration telling them so — they need to know that
 * this is where things will appear, and then to be left alone to describe their
 * problem.
 */
export function PaneEmptyState({ message = PANE_COPY.empty }: { message?: string }) {
  return <p className="pane__empty">{message}</p>;
}
