'use client';

import { useEffect, useRef } from 'react';

/**
 * Keeps the latest turn in view — but only when the visitor is already at the
 * bottom.
 *
 * Auto-scrolling someone who has deliberately scrolled up to re-read what they
 * wrote is the single most irritating behaviour a transcript can have, so the
 * caller passes `active` and this component does nothing when it is false.
 *
 * It scrolls the CONTAINER, never the document, and it never moves focus:
 * a visitor typing while a response arrives is never interrupted
 * (Surface 1 v5.0 §3.7).
 */
export function ScrollAnchor({ active, dependency, threadId }: {
  active: boolean; dependency: unknown; threadId: string | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const previousThread = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const changedThread = previousThread.current !== threadId;
    previousThread.current = threadId;
    // Scroll memory owns initial load and thread changes. Smooth auto-follow
    // must not race its saved offset when returning to an older conversation.
    if (changedThread || !active) return;
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'end', behavior: reduced ? 'auto' : 'smooth' });
  }, [active, dependency, threadId]);

  return <div ref={ref} aria-hidden="true" className="transcript__anchor" />;
}
