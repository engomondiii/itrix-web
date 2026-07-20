import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Sidebar UI state — collapse and the mobile sheet.
 *
 * THIS IS PRESENTATION ONLY. Collapsing the sidebar never changes what is
 * authorized; the section list comes from the backend contract and nothing here
 * can add to it or take from it (Surface 1 v5.0 §3.2).
 *
 * `collapsed` persists because it is a genuine preference. `sheetOpen` does not:
 * a slide-over that reopens itself on the next visit is a bug, not a memory.
 */
interface SidebarState {
  collapsed: boolean;
  sheetOpen: boolean;

  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  openSheet: () => void;
  closeSheet: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      sheetOpen: false,

      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
      openSheet: () => set({ sheetOpen: true }),
      closeSheet: () => set({ sheetOpen: false }),
    }),
    { name: 'itrix.sidebar', partialize: (s) => ({ collapsed: s.collapsed }) },
  ),
);
