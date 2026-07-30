import { create } from 'zustand';
import type { PendingStage } from '@/lib/content/pendingCopy';

/**
 * WHETHER A TURN IS IN FLIGHT, AND WHICH STAGE IT IS AT.
 *
 * ── WHY THIS STORE EXISTS AT ALL ────────────────────────────────────────────
 * Surface 1 v6.0 §05 lists `usePendingStage.ts` and not a store. A hook cannot
 * share state between the composer that starts a wait and the transcript that
 * renders it, so one of the two would have to own the other — and the composer
 * owning transcript state is the wrong direction. This is the smallest thing that
 * closes the gap.
 *
 * ── THE HONESTY RULE, ENFORCED HERE ─────────────────────────────────────────
 * `stage` advances ONLY when the backend says so, via `message.stage` (R42). There
 * is no timer, no interpolation and no optimistic progression. When no stage has
 * been reported, `stage` is null and the indicator holds a neutral label rather
 * than inventing the next step.
 *
 * `startedAt` exists for the timeout, which is the one time-based behaviour that IS
 * honest: after PENDING_TIMEOUT_MS with nothing at all, saying "this is taking
 * longer than usual" reports a fact rather than a guess.
 */
export interface PendingTurn {
  startedAt: number;
  stage: PendingStage | null;
  /** True once the timeout has elapsed with no delta and no stage. */
  slow: boolean;
}

interface PendingState {
  byThread: Record<string, PendingTurn>;

  /** The visitor submitted. A wait begins. */
  begin: (threadId: string) => void;
  /** The backend reported a real pipeline transition. */
  setStage: (threadId: string, stage: PendingStage) => void;
  /** Nothing has arrived for too long. */
  markSlow: (threadId: string) => void;
  /** First delta, settle, halt or review — the wait is over. */
  end: (threadId: string) => void;
}

export const usePendingStore = create<PendingState>((set) => ({
  byThread: {},

  begin: (threadId) =>
    set((s) => ({
      byThread: { ...s.byThread, [threadId]: { startedAt: Date.now(), stage: null, slow: false } },
    })),

  setStage: (threadId, stage) =>
    set((s) => {
      const current = s.byThread[threadId];
      /* A stage for a thread with no wait in progress is ignored rather than
         starting one. The wait begins when the visitor submits, not when a late
         event arrives for a turn that already settled. */
      if (!current) return s;
      return { byThread: { ...s.byThread, [threadId]: { ...current, stage, slow: false } } };
    }),

  markSlow: (threadId) =>
    set((s) => {
      const current = s.byThread[threadId];
      if (!current) return s;
      return { byThread: { ...s.byThread, [threadId]: { ...current, slow: true } } };
    }),

  end: (threadId) =>
    set((s) => {
      if (!s.byThread[threadId]) return s;
      const next = { ...s.byThread };
      delete next[threadId];
      return { byThread: next };
    }),
}));
