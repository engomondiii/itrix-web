'use client';

import { PANE_COPY, PANE_COPY_KO } from '@/lib/content/paneCopy';
import { useLocaleStore } from '@/store/localeStore';

/**
 * The pane with nothing in it yet.
 *
 * A SENTENCE, not a decorative panel. A visitor whose conversation has produced
 * nothing does not need an illustration telling them so — they need to know that
 * this is where things will appear, and then to be left alone to describe their
 * problem.
 */
export function PaneEmptyState({ message }: { message?: string }) {
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const resolved = message ?? (ko ? PANE_COPY_KO.empty : PANE_COPY.empty);
  return <p className="pane__empty">{resolved}</p>;
}
