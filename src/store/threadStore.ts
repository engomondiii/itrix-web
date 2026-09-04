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
 * The list is a CONVENIENCE mirror. The backend wins on CONTENT — `mergeFromServer`
 * overwrites server-owned metadata — but NOT on ABSENCE and not over a title the
 * visitor explicitly renamed. Removal is explicit, through `remove`.
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
  /** Merge the backend's current metadata answer into the local convenience mirror. */
  mergeFromServer: (threads: ThreadSummary[]) => void;
  reset: () => void;
}

type LocalThreadSummary = ThreadSummary & { __manualTitle?: true };

function byRecency(a: ThreadSummary, b: ThreadSummary): number {
  return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
}

/**
 * Merge metadata without erasing either a stable title or an explicit manual rename.
 *
 * Partial transport updates are allowed to advance server-owned metadata, but a
 * generated/re-generated backend title must not overwrite a name the visitor explicitly
 * chose. The private marker lives only in the persisted metadata mirror and never travels
 * in thread API requests.
 */
function mergeSummary(existing: ThreadSummary | undefined, incoming: ThreadSummary): ThreadSummary {
  if (!existing) return incoming;

  const local = existing as LocalThreadSummary;
  const manualTitle = local.__manualTitle === true;
  return {
    ...existing,
    ...incoming,
    title: manualTitle ? existing.title : (incoming.title.trim() || existing.title),
    createdAt: existing.createdAt || incoming.createdAt,
    lastActivityAt: incoming.lastActivityAt || existing.lastActivityAt,
    ...(manualTitle ? { __manualTitle: true } : {}),
  } as LocalThreadSummary;
}

function isMessagingOnlyThread(thread: ThreadSummary): boolean {
  if (thread.context === 'portal' || thread.context === 'customer_success') return true;
  // Compatibility cleanup for metadata persisted before `context` was kept client-side.
  // That generated title was reserved for the portal inbox thread.
  return !thread.context && thread.title === 'Portal conversation';
}

export const useThreadStore = create<ThreadState>()(
  persist(
    (set) => ({
      threads: [],
      activeThreadId: null,

      setActive: (id) => set({ activeThreadId: id }),

      upsert: (thread) =>
        set((s) => {
          const existing = s.threads.find((t) => t.id === thread.id);
          const merged = mergeSummary(existing, thread);
          const rest = s.threads.filter((t) => t.id !== thread.id);
          return { threads: [merged, ...rest].sort(byRecency) };
        }),

      rename: (id, title) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === id ? ({ ...t, title, __manualTitle: true } as LocalThreadSummary) : t,
          ),
        })),

      remove: (id) =>
        set((s) => ({
          threads: s.threads.filter((t) => t.id !== id),
          activeThreadId: s.activeThreadId === id ? null : s.activeThreadId,
        })),

      /* MERGE, NOT REPLACE. A failed/short list response cannot erase local names,
         while server metadata still updates normally. Explicit manual titles are the
         one exception: once the visitor names a conversation, generated titles remain
         subordinate until that local metadata is removed. */
      mergeFromServer: (incoming) =>
        set((s) => {
          // The AI rail and the client↔itriX inbox are separate products. Drop any
          // legacy portal row that older builds persisted in localStorage, then merge
          // only AI conversation metadata returned by /threads/.
          const byId = new Map(
            s.threads.filter((t) => !isMessagingOnlyThread(t)).map((t) => [t.id, t]),
          );
          for (const t of incoming) {
            if (!isMessagingOnlyThread(t)) byId.set(t.id, mergeSummary(byId.get(t.id), t));
          }
          const activeStillExists = !s.activeThreadId || byId.has(s.activeThreadId);
          return {
            threads: [...byId.values()].sort(byRecency),
            activeThreadId: activeStillExists ? s.activeThreadId : null,
          };
        }),

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
