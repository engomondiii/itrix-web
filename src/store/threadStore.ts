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
 * overwrites any thread it returns, field for field — but NOT on ABSENCE. An answer
 * that arrives short or empty no longer erases names the visitor can see; removal is
 * explicit, through `remove`.
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

/**
 * Merge a metadata update without ever erasing the visible conversation name.
 *
 * `POST /threads/{id}/turns/` intentionally returns only `{threadId, turn,
 * assistantTurn}`. The frontend normaliser therefore has no title for that response.
 * Before this guard, the resulting empty `title` replaced the existing sidebar row on
 * every follow-up turn, leaving only "4m ago"/"9m ago" visible and making the time look
 * like the conversation's name. A partial transport update may advance activity time,
 * but it may never blank stable metadata it did not carry.
 */
function mergeSummary(existing: ThreadSummary | undefined, incoming: ThreadSummary): ThreadSummary {
  if (!existing) return incoming;

  return {
    ...existing,
    ...incoming,
    title: incoming.title.trim() || existing.title,
    createdAt: existing.createdAt || incoming.createdAt,
    lastActivityAt: incoming.lastActivityAt || existing.lastActivityAt,
  };
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
        set((s) => ({ threads: s.threads.map((t) => (t.id === id ? { ...t, title } : t)) })),

      remove: (id) =>
        set((s) => ({
          threads: s.threads.filter((t) => t.id !== id),
          activeThreadId: s.activeThreadId === id ? null : s.activeThreadId,
        })),

      /* MERGE, NOT REPLACE (change request, 2026-08).
         This used to overwrite the list outright, which meant any answer the
         backend could not fully give — a dropped visitor-session cookie, a cold
         start, a 5xx that read as an empty list — silently erased every chat
         name the visitor could see. The names came back on the next good
         refresh, but by then the sidebar had already looked broken.

         The server still wins on CONTENT: a thread it returns replaces the local
         copy field for field, so a renamed or re-titled conversation updates as
         before. It just no longer wins on ABSENCE. Deletion is explicit and
         local (`remove`), so nothing here can resurrect a conversation the
         visitor asked us to forget. */
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
