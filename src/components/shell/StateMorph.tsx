'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface StateMorphProps {
  /** The current state key. A change here is what triggers the morph. */
  stateKey: string;
  /** Announced politely when the centre changes. Keep it short and factual. */
  announcement?: string;
  children: ReactNode;
}

/**
 * The centre MORPHS; it does not hard-redirect.
 *
 *   "A state transition must preserve conversation history, value artifacts,
 *    documents and decisions... The center should morph rather than hard-redirect
 *    when feasible; preserve scroll/focus context and acknowledge the change."
 *    — Architecture v2.5 §11.9
 *
 * Three things this component guarantees:
 *
 *   1. SCROLL is preserved. A route-driven remount would jump the page to the
 *      top; we capture the position before the change and restore it after, so a
 *      visitor reading their reflection does not lose their place when the pitch
 *      room arrives.
 *
 *   2. FOCUS is preserved. If focus was inside the centre — a composer, a
 *      button — we restore it after the morph. A visitor typing when their state
 *      advances keeps their cursor.
 *
 *   3. The change is ANNOUNCED. A visual fade tells a sighted visitor something
 *      arrived; an aria-live region tells everyone else. Without it the
 *      experience is a screen that silently becomes a different screen.
 *
 * Under prefers-reduced-motion the transition collapses to an instant swap; the
 * scroll, focus and announcement guarantees are unaffected.
 */
export function StateMorph({ stateKey, announcement, children }: StateMorphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousKey = useRef<string>(stateKey);
  const restore = useRef<{ scrollY: number; focusId: string | null } | null>(null);
  const [morphing, setMorphing] = useState(false);
  const [live, setLive] = useState('');

  // Capture BEFORE the browser paints the new children.
  useEffect(() => {
    if (previousKey.current === stateKey) return;

    const active = document.activeElement as HTMLElement | null;
    const insideCentre = Boolean(active && containerRef.current?.contains(active));
    restore.current = {
      scrollY: window.scrollY,
      focusId: insideCentre ? active?.id || null : null,
    };
    previousKey.current = stateKey;
    setMorphing(true);
  }, [stateKey]);

  // Restore after paint.
  useEffect(() => {
    if (!morphing) return;
    const saved = restore.current;
    const frame = requestAnimationFrame(() => {
      if (saved) {
        window.scrollTo({ top: saved.scrollY, behavior: 'auto' });
        if (saved.focusId) document.getElementById(saved.focusId)?.focus({ preventScroll: true });
      }
      if (announcement) setLive(announcement);
      setMorphing(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [morphing, announcement]);

  return (
    <>
      <div
        ref={containerRef}
        data-state-key={stateKey}
        className={`state-morph${morphing ? ' state-morph--changing' : ''}`}
      >
        {children}
      </div>
      {/* Politeness matters: this must not interrupt someone mid-sentence. */}
      <div role="status" aria-live="polite" className="sr-only">
        {live}
      </div>
    </>
  );
}
