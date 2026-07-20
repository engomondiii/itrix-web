import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThreadSummary } from '@/types/thread.types';

/**
 * The conversation list and the active thread.
 *
 * PRIVACY DECISION, and it is deliberate: this store persists thread METADATA
 * only — id, title, timestamps. It never persists turn bodies. A visitor's
 * description of their bottleneck is exactly the kind of thing that should not
 * sit in localStorage on a shared machine, and the backend already holds the
 * transcript under the session with a documented retention window
 * (Architecture v2.6 §10.3). On reload the transcript is re-fetched, never
 * restored from the browser.
 *
 * The list is a CONVENIENCE mirror. The backend's list wins whenever it answers:
 * `mergeFromServer` replaces rather than merges, so a thread the backend has
 * dropped disappears here too.
 *
 * Surface 1 v5.0 §3.2, §7.5
 */
interface ThreadState {
  threads: ThreadSummary[];
  activeThreadId: string | null;

  setActive: (id: string | null) => void;
  upsert: (thread: ThreadSummary) => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  /** Replace the local list with the backend's answer. Absolute, not a delta. */
  mergeFromServer: (threads: ThreadSummary[]) => void;
  reset: () => void;
}

function byRecency(a: ThreadSummary, b: ThreadSummary): number {
  return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
}

export const useThreadStore = create<ThreadState>()(
  persist(
    (set) => ({
      threads: [],
      activeThreadId: null,

      setActive: (id) => set({ activeThreadId: id }),

      upsert: (thread) =>
        set((s) => {
          const rest = s.threads.filter((t) => t.id !== thread.id);
          return { threads: [thread, ...rest].sort(byRecency) };
        }),

      rename: (id, title) =>
        set((s) => ({ threads: s.threads.map((t) => (t.id === id ? { ...t, title } : t)) })),

      remove: (id) =>
        set((s) => ({
          threads: s.threads.filter((t) => t.id !== id),
          activeThreadId: s.activeThreadId === id ? null : s.activeThreadId,
        })),

      mergeFromServer: (threads) => set({ threads: [...threads].sort(byRecency) }),

      reset: () => set({ threads: [], activeThreadId: null }),
    }),
    {
      name: 'itrix.threads',
      /* Metadata only. `activeThreadId` is deliberately NOT persisted: which
         conversation is open is a property of this tab, not of the browser. */
      partialize: (s) => ({ threads: s.threads }),
    },
  ),
);
