import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContentPaneSection } from '@/lib/journey/contentPaneSections';

/**
 * CONTENT-PANE UI STATE — presentation only.
 *
 * COLLAPSING THE PANE CHANGES NOTHING ABOUT AUTHORIZATION (Surface 1 v6.0 §3.11).
 * The section list comes from the backend contract and nothing here can add to it
 * or take from it. What this store holds is which section is showing, which
 * artifact is focused, and whether the visitor has folded the pane away.
 *
 * ── ALL OF IT IS KEYED BY THREAD ────────────────────────────────────────────
 * Switching conversations must not carry the previous thread's open artifact
 * across, and a visitor who collapsed the pane in one thread has not asked for it
 * to be collapsed in another (§3.12). Keying by thread makes both true without a
 * clearing effect — and a clearing effect is what would briefly show the wrong
 * artifact before correcting itself.
 *
 * `collapsedByThread` persists, because folding the pane away is a real
 * preference. The active section and artifact do NOT: which thing you were reading
 * is a property of this visit, and restoring it days later would be presumptuous.
 * The sheet is never persisted — an overlay that reopens itself is a bug.
 */
interface ContentPaneState {
  collapsedByThread: Record<string, boolean>;
  activeSectionByThread: Record<string, ContentPaneSection>;
  activeArtifactByThread: Record<string, string>;
  sheetOpen: boolean;

  isCollapsed: (threadId: string | null) => boolean;
  setCollapsed: (threadId: string | null, collapsed: boolean) => void;
  toggleCollapsed: (threadId: string | null) => void;

  activeSection: (threadId: string | null) => ContentPaneSection | null;
  setActiveSection: (threadId: string | null, section: ContentPaneSection) => void;

  activeArtifact: (threadId: string | null) => string | null;
  setActiveArtifact: (threadId: string | null, artifactId: string) => void;

  openSheet: () => void;
  closeSheet: () => void;

  /** Drop a thread's state when the thread is deleted. */
  forgetThread: (threadId: string) => void;
}

export const useContentPaneStore = create<ContentPaneState>()(
  persist(
    (set, get) => ({
      collapsedByThread: {},
      activeSectionByThread: {},
      activeArtifactByThread: {},
      sheetOpen: false,

      isCollapsed: (threadId) => (threadId ? Boolean(get().collapsedByThread[threadId]) : false),
      setCollapsed: (threadId, collapsed) =>
        set((s) =>
          threadId
            ? { collapsedByThread: { ...s.collapsedByThread, [threadId]: collapsed } }
            : s,
        ),
      toggleCollapsed: (threadId) =>
        set((s) =>
          threadId
            ? {
                collapsedByThread: {
                  ...s.collapsedByThread,
                  [threadId]: !s.collapsedByThread[threadId],
                },
              }
            : s,
        ),

      activeSection: (threadId) => (threadId ? get().activeSectionByThread[threadId] ?? null : null),
      setActiveSection: (threadId, section) =>
        set((s) =>
          threadId
            ? { activeSectionByThread: { ...s.activeSectionByThread, [threadId]: section } }
            : s,
        ),

      activeArtifact: (threadId) => (threadId ? get().activeArtifactByThread[threadId] ?? null : null),
      setActiveArtifact: (threadId, artifactId) =>
        set((s) =>
          threadId
            ? { activeArtifactByThread: { ...s.activeArtifactByThread, [threadId]: artifactId } }
            : s,
        ),

      openSheet: () => set({ sheetOpen: true }),
      closeSheet: () => set({ sheetOpen: false }),

      forgetThread: (threadId) =>
        set((s) => {
          const collapsed = { ...s.collapsedByThread };
          const section = { ...s.activeSectionByThread };
          const artifact = { ...s.activeArtifactByThread };
          delete collapsed[threadId];
          delete section[threadId];
          delete artifact[threadId];
          return {
            collapsedByThread: collapsed,
            activeSectionByThread: section,
            activeArtifactByThread: artifact,
          };
        }),
    }),
    {
      name: 'itrix.content-pane',
      partialize: (s) => ({ collapsedByThread: s.collapsedByThread }),
    },
  ),
);
