import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Conversation-rail UI state — collapse and the mobile sheet.
 *
 * REPLACES store/sidebarStore.ts. Same contract, new name, because the thing it
 * describes is no longer a sidebar full of navigation: it is the conversation
 * rail (Architecture v2.7 §11.6).
 *
 * THIS IS PRESENTATION ONLY. Collapsing the rail never changes what is
 * authorized; the section list comes from the backend contract and nothing here
 * can add to it or take from it.
 *
 * `collapsed` persists because it is a genuine preference. `sheetOpen` does not:
 * a slide-over that reopens itself on the next visit is a bug, not a memory.
 */
interface RailState {
  collapsed: boolean;
  sheetOpen: boolean;

  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  openSheet: () => void;
  closeSheet: () => void;
}

export const useRailStore = create<RailState>()(
  persist(
    (set) => ({
      collapsed: false,
      sheetOpen: false,

      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
      openSheet: () => set({ sheetOpen: true }),
      closeSheet: () => set({ sheetOpen: false }),
    }),
    { name: 'itrix.rail', partialize: (s) => ({ collapsed: s.collapsed }) },
  ),
);
