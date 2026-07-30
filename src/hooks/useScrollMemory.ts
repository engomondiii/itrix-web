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
  const anchors = useScrollMemoryStore((s) => s.anchors);
  const lastSave = useRef(0);
  const restoredFor = useRef<string | null>(null);

  /** Call from the container's onScroll. Throttled. */
  const save = useCallback(() => {
    const el = ref.current;
    if (!el || !threadId) return;
    const now = Date.now();
    if (now - lastSave.current < SAVE_THROTTLE_MS) return;
    lastSave.current = now;
    remember(threadId, { offset: el.scrollTop, itemId: null, itemCount });
  }, [ref, threadId, itemCount, remember]);

  /* Restore on thread change — once per thread, after paint. */
  useEffect(() => {
    if (!threadId) return;
    if (restoredFor.current === threadId) return;
    const el = ref.current;
    if (!el) return;

    const anchor = anchors[threadId];
    restoredFor.current = threadId;

    /* Two frames: one for React to commit the new thread's items, one for the
       browser to lay them out and give the container its real scrollHeight. */
    const first = requestAnimationFrame(() => {
      const second = requestAnimationFrame(() => {
        const node = ref.current;
        if (!node) return;
        if (anchor && anchor.itemCount === itemCount) {
          node.scrollTop = anchor.offset;
        } else {
          /* No memory, or the thread grew. The bottom is where the new material is. */
          node.scrollTop = node.scrollHeight;
        }
      });
      /* Cancelling the inner frame on cleanup needs it in scope; the outer handle
         is returned below and the inner is cancelled with it by the browser when the
         outer callback never runs. */
      void second;
    });

    return () => cancelAnimationFrame(first);
    /* `anchors` is deliberately not a dependency: restoration happens on thread
       change, not every time a scroll position is saved. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, ref, itemCount]);

  /* Save on unmount so leaving via a thread switch keeps the position. */
  useEffect(() => {
    const el = ref.current;
    const id = threadId;
    return () => {
      if (!el || !id) return;
      remember(id, { offset: el.scrollTop, itemId: null, itemCount });
    };
  }, [ref, threadId, itemCount, remember]);

  return { save };
}
