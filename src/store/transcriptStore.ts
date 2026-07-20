import { create } from 'zustand';
import type { Turn } from '@/types/thread.types';

/**
 * The transcript — turns, keyed by thread.
 *
 * IN MEMORY ONLY. See threadStore for why: turn bodies are the visitor's own
 * description of their problem and do not belong in browser storage.
 *
 * Ordering is by `seq`, which the server assigns monotonically per thread. Two
 * consequences, both deliberate:
 *
 *   · `append` is idempotent by id, so an optimistic turn the server later
 *     confirms replaces itself instead of appearing twice.
 *   · `hasGap` reports a missing sequence rather than letting the UI render a
 *     hole. Phase 2 uses it to trigger a re-fetch; it is exposed now so the
 *     contract is settled before streaming lands.
 *
 * A state change APPENDS. It never clears, resets or reorders prior turns
 * (Surface 1 v5.0 §3.7).
 */
interface TranscriptState {
  turnsByThread: Record<string, Turn[]>;

  append: (threadId: string, turn: Turn) => void;
  appendMany: (threadId: string, turns: Turn[]) => void;
  replace: (threadId: string, turns: Turn[]) => void;
  /** Patch one turn in place — used when a pending turn settles. */
  update: (threadId: string, turnId: string, patch: Partial<Turn>) => void;
  clearThread: (threadId: string) => void;
  reset: () => void;
}

function sortAndDedupe(turns: Turn[]): Turn[] {
  const byId = new Map<string, Turn>();
  for (const t of turns) byId.set(t.id, t);
  return [...byId.values()].sort((a, b) => a.seq - b.seq);
}

export const useTranscriptStore = create<TranscriptState>((set) => ({
  turnsByThread: {},

  append: (threadId, turn) =>
    set((s) => ({
      turnsByThread: {
        ...s.turnsByThread,
        [threadId]: sortAndDedupe([...(s.turnsByThread[threadId] ?? []), turn]),
      },
    })),

  appendMany: (threadId, turns) =>
    set((s) => ({
      turnsByThread: {
        ...s.turnsByThread,
        [threadId]: sortAndDedupe([...(s.turnsByThread[threadId] ?? []), ...turns]),
      },
    })),

  replace: (threadId, turns) =>
    set((s) => ({ turnsByThread: { ...s.turnsByThread, [threadId]: sortAndDedupe(turns) } })),

  update: (threadId, turnId, patch) =>
    set((s) => {
      const current = s.turnsByThread[threadId];
      if (!current) return s;
      return {
        turnsByThread: {
          ...s.turnsByThread,
          [threadId]: sortAndDedupe(current.map((t) => (t.id === turnId ? { ...t, ...patch } : t))),
        },
      };
    }),

  clearThread: (threadId) =>
    set((s) => {
      const next = { ...s.turnsByThread };
      delete next[threadId];
      return { turnsByThread: next };
    }),

  reset: () => set({ turnsByThread: {} }),
}));

/** True when sequence numbers skip — the caller should re-fetch, not guess. */
export function hasGap(turns: readonly Turn[]): boolean {
  for (let i = 1; i < turns.length; i += 1) {
    if (turns[i].seq - turns[i - 1].seq > 1) return true;
  }
  return false;
}
