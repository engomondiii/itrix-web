import { create } from 'zustand';

/**
 * PER-THREAD SCROLL POSITION (Surface 1 v6.0 §3.12, R37).
 *
 * "A returned-to thread opens where the visitor left it, not at the top."
 *
 * ── IN MEMORY ONLY, AND FOR THE SESSION ONLY ────────────────────────────────
 * The specification says the position is retained FOR THE SESSION. That is not a
 * shortcut: a scroll offset is a weak but real signal about which part of a
 * conversation someone was reading, and the transcript itself is deliberately not
 * persisted to browser storage for exactly that reason (see threadStore). Keeping
 * the offset while dropping the text it points into would be inconsistent.
 *
 * The anchor is stored as a pixel offset AND the id of the last turn that was
 * fully visible. The offset is used when the thread's content is unchanged; the
 * turn id is the fallback when new turns have arrived and every offset has moved.
 */
export interface ScrollAnchor {
  offset: number;
  /** The last item id at or above the viewport bottom when we saved. */
  itemId: string | null;
  /** How many items the thread had. A change means offsets are stale. */
  itemCount: number;
}

interface ScrollMemoryState {
  anchors: Record<string, ScrollAnchor>;
  remember: (threadId: string, anchor: ScrollAnchor) => void;
  recall: (threadId: string | null) => ScrollAnchor | null;
  forget: (threadId: string) => void;
}

export const useScrollMemoryStore = create<ScrollMemoryState>((set, get) => ({
  anchors: {},

  remember: (threadId, anchor) =>
    set((s) => ({ anchors: { ...s.anchors, [threadId]: anchor } })),

  recall: (threadId) => (threadId ? get().anchors[threadId] ?? null : null),

  forget: (threadId) =>
    set((s) => {
      const next = { ...s.anchors };
      delete next[threadId];
      return { anchors: next };
    }),
}));
