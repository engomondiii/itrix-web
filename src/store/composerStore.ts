import { create } from 'zustand';

/**
 * The composer's own state.
 *
 * It lives in a store rather than in component state for one reason: the example
 * chips on the landing and (from Phase 2) the suggestion chips above the
 * composer both POPULATE it without submitting. Passing that through props would
 * mean the chips and the composer had to be siblings, which they are not.
 *
 * NOTE WHAT IS NOT HERE: there is no `maxLength`, no character count and no
 * `over` flag. The 600-character ceiling is gone (R28). The server keeps a
 * safety cap and reports it as a recoverable message; the UI never pre-empts the
 * visitor's sentence.
 *
 * Optional question guidance never writes a routing/persona prior. Clicking guidance
 * only populates `value`; journey/relationship decisions remain server-side.
 */
/** One prompt waiting behind the turn currently in flight. */
export interface QueuedPrompt {
  /** The optimistic turn already on screen for this prompt. */
  optimisticId: string;
  threadId: string;
  body: string;
  attachmentIds: string[];
}

interface ComposerState {
  value: string;
  submitting: boolean;
  error: string | null;
  /** Set when the composer should take focus — chips use it after populating. */
  focusRequest: number;

  /**
   * PROMPTS WAITING THEIR TURN (change request, 2026-08).
   *
   * A visitor may send again while itriX is still answering. Each extra message
   * is appended to the transcript immediately — they can see it was accepted —
   * and parked here until the in-flight turn settles, then sent in order.
   *
   * FIFO, and it must stay FIFO: a conversation whose turns arrive out of the
   * order they were written is a conversation neither side can follow.
   */
  queue: QueuedPrompt[];
  enqueue: (item: QueuedPrompt) => void;
  /** Take the next prompt, or null when the queue is empty. */
  dequeue: () => QueuedPrompt | null;
  clearQueue: () => void;

  setValue: (value: string) => void;
  /** Populate from a chip. Never submits. */
  populate: (value: string) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  requestFocus: () => void;
  clear: () => void;
}

export const useComposerStore = create<ComposerState>((set, get) => ({
  value: '',
  submitting: false,
  error: null,
  focusRequest: 0,
  queue: [],

  enqueue: (item) => set((s) => ({ queue: [...s.queue, item] })),

  dequeue: () => {
    const [next, ...rest] = get().queue;
    if (!next) return null;
    set({ queue: rest });
    return next;
  },

  clearQueue: () => set({ queue: [] }),

  setValue: (value) => set((s) => ({ value, error: s.error ? null : s.error })),

  populate: (value) =>
    set((s) => ({
      value,
      error: null,
      focusRequest: s.focusRequest + 1,
    })),

  setSubmitting: (submitting) => set({ submitting }),
  setError: (error) => set({ error }),
  requestFocus: () => set((s) => ({ focusRequest: s.focusRequest + 1 })),

  /* Clears the DRAFT only. The queue is deliberately untouched: `clear` runs on
     every submit, and emptying the queue there would discard the prompts the
     visitor sent while waiting. */
  clear: () => set({ value: '', error: null }),
}));
