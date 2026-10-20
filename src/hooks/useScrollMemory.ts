'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useScrollMemoryStore } from '@/store/scrollMemoryStore';

/**
 * PER-THREAD SCROLL RESTORATION (Surface 1 v6.0 §3.12, R37).
 *
 * "A returned-to thread opens where the visitor left it, not at the top."
 *
 * ── WHY THE ANCHOR IS TWO THINGS ────────────────────────────────────────────
 * A pixel offset is exact but goes stale the moment new turns arrive — a thread
 * that gained two turns while you were elsewhere has moved every offset in it. So
 * the anchor also records the item COUNT: if it matches, the offset is trusted; if
 * it does not, the thread has grown and the visitor is taken to the bottom, which
 * is where the new material is and where they would have scrolled anyway.
 *
 * ── WHY RESTORATION RUNS AFTER PAINT ────────────────────────────────────────
 * The transcript's content height is not known until the browser has laid it out.
 * Setting scrollTop before that clamps to the container's current (smaller) height
 * and lands the visitor near the top — which looks exactly like the bug this hook
 * exists to prevent. Two frames of delay is the cost of it working.
 *
 * Saving is throttled and passive: a scroll handler that writes to a store on every
 * event is a scroll handler that makes scrolling feel heavy.
 */
const SAVE_THROTTLE_MS = 250;

export interface UseScrollMemoryOptions {
  threadId: string | null;
  /** The scrolling container. */
  ref: React.RefObject<HTMLDivElement | null>;
  /** How many items the transcript is showing, so staleness can be detected. */
  itemCount: number;
}

export function useScrollMemory({ threadId, ref, itemCount }: UseScrollMemoryOptions) {
  const remember = useScrollMemoryStore((s) => s.remember);
  const lastSave = useRef(0);
  const restoredFor = useRef<string | null>(null);
  const lastPosition = useRef<{ threadId: string; offset: number; itemCount: number } | null>(null);

  /** Call from the container's onScroll. Throttled. */
  const save = useCallback(() => {
    const el = ref.current;
    if (!el || !threadId || restoredFor.current !== threadId) return;
    lastPosition.current = { threadId, offset: el.scrollTop, itemCount };
    const now = Date.now();
    if (now - lastSave.current < SAVE_THROTTLE_MS) return;
    lastSave.current = now;
    remember(threadId, { offset: el.scrollTop, itemId: null, itemCount });
  }, [ref, threadId, itemCount, remember]);

  /* Restore only after items exist. Cancel both frames when a fetch or another
     switch changes the content before layout has completed. */
  useEffect(() => {
    if (!threadId) {
      restoredFor.current = null;
      return;
    }
    if (restoredFor.current === threadId || itemCount === 0) return;
    const anchor = useScrollMemoryStore.getState().anchors[threadId];
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        const node = ref.current;
        if (!node) return;
        node.scrollTop = anchor && anchor.itemCount === itemCount
          ? anchor.offset : node.scrollHeight;
        restoredFor.current = threadId;
        lastPosition.current = { threadId, offset: node.scrollTop, itemCount };
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [threadId, ref, itemCount]);

  /* React has already replaced the DOM by passive-effect cleanup. Reading
     scrollTop there saves the NEW thread's clamped position under the OLD id.
     Persist the last observed position instead, including throttled events. */
  useEffect(() => {
    return () => {
      const position = lastPosition.current;
      if (!threadId || position?.threadId !== threadId) return;
      remember(threadId, { offset: position.offset, itemId: null, itemCount: position.itemCount });
    };
  }, [threadId, remember]);

  return { save };
}
