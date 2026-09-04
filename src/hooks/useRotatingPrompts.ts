'use client';

import { useCallback, useState } from 'react';
import { EXAMPLE_PROMPTS } from '@/lib/content/examplePrompts';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/** Reviewer-corrected Optional Question Ideas controller.
 *
 * The five suggestions remain reachable by Previous/Next, dots and Show all, but
 * nothing advances on a timer and there is no dwell/progress animation. Selecting a
 * suggestion remains presentation-only and never changes persona/relationship state.
 */
export interface UseRotatingPromptsOptions {
  stopped?: boolean;
}

export interface UseRotatingPromptsResult {
  index: number;
  count: number;
  reducedMotion: boolean;
  showAll: boolean;
  toggleShowAll: () => void;
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  paused: boolean;
  pauseHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
}

export function useRotatingPrompts(options: UseRotatingPromptsOptions = {}): UseRotatingPromptsResult {
  void options; // kept for call-site compatibility; automatic rotation is intentionally disabled.
  const count = EXAMPLE_PROMPTS.length;
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const previous = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const toggleShowAll = useCallback(() => setShowAll((v) => !v), []);
  const goTo = useCallback((i: number) => setIndex(Math.max(0, Math.min(count - 1, i))), [count]);
  const noop = useCallback(() => undefined, []);

  return {
    index,
    count,
    reducedMotion,
    showAll,
    toggleShowAll,
    next,
    previous,
    goTo,
    paused: true,
    pauseHandlers: { onMouseEnter: noop, onMouseLeave: noop, onFocus: noop, onBlur: noop },
  };
}
