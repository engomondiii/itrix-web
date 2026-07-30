'use client';

import { useCallback, useEffect, useState } from 'react';
import { EXAMPLE_PROMPTS } from '@/lib/content/examplePrompts';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * The rotating example prompts (Surface 1 v6.0 §2.3, R38).
 *
 * The five prompts and their one-to-one mapping onto the functional families are
 * UNCHANGED. Only their presentation rotates — which imposes three requirements
 * that this hook exists to satisfy:
 *
 *   · ALL FIVE MUST BE REACHABLE WITHOUT WAITING. The caller renders a
 *     `Show all five` disclosure; `showAll` is that state, and turning it on
 *     stops rotation.
 *   · ROTATION IS PRESENTATION, NOT CONTENT. This hook never records a family
 *     prior. The caller records the prior from the prompt the visitor actually
 *     SELECTED, never from whichever happened to be visible.
 *   · A CAROUSEL IS NOT A LIVE REGION. Nothing here announces anything.
 *
 * IT PAUSES on pointer hover, on keyboard focus anywhere in the group, on a
 * hidden tab, once the visitor has typed, and permanently under
 * `prefers-reduced-motion` — where the caller renders all five statically instead.
 */

const DWELL_MS = 4500;

export interface UseRotatingPromptsOptions {
  /** True once the composer has any content. Rotation stops for good. */
  stopped?: boolean;
}

export interface UseRotatingPromptsResult {
  index: number;
  count: number;
  /** True when motion is unwanted: the caller renders the static list instead. */
  reducedMotion: boolean;
  showAll: boolean;
  toggleShowAll: () => void;
  next: () => void;
  previous: () => void;
  /** Spread onto the group element. */
  pauseHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
}

export function useRotatingPrompts(
  { stopped = false }: UseRotatingPromptsOptions = {},
): UseRotatingPromptsResult {
  const count = EXAMPLE_PROMPTS.length;
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const previous = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const toggleShowAll = useCallback(() => setShowAll((v) => !v), []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const paused = reducedMotion || showAll || stopped || hovered || focused || tabHidden;

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, DWELL_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  return {
    index,
    count,
    reducedMotion,
    showAll,
    toggleShowAll,
    next,
    previous,
    pauseHandlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  };
}
