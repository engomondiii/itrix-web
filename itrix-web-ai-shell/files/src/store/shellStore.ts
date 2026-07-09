import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Shell UI state (Surface 1 v3.1 — the AI-app shell).
 *
 * The public surface is presented as a modern AI-application shell rather than a
 * traditional website: a collapsible left rail (which carries what used to be the
 * top header) and a wide content canvas whose gravitational centre is a large
 * prompt composer. This store owns the rail's presentation state so any component
 * — the rail itself, the canvas, the mobile trigger — can read and drive it.
 *
 *   collapsed : the rail is reduced to a thin icon rail (desktop).
 *   hidden    : the rail is fully off-canvas so the canvas is full-bleed
 *               (used on the landing "focus mode" and on mobile by default).
 *   mobileOpen: the rail is shown as an overlay on small screens.
 *
 * `collapsed` is persisted so a returning visitor keeps their chosen width;
 * `mobileOpen` is intentionally NOT persisted (it is a transient overlay).
 */
interface ShellState {
  collapsed: boolean;
  hidden: boolean;
  mobileOpen: boolean;

  toggleCollapsed: () => void;
  setCollapsed: (v: boolean) => void;

  toggleHidden: () => void;
  setHidden: (v: boolean) => void;

  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

export const useShellStore = create<ShellState>()(
  persist(
    (set) => ({
      collapsed: false,
      hidden: false,
      mobileOpen: false,

      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (v) => set({ collapsed: v }),

      toggleHidden: () => set((s) => ({ hidden: !s.hidden })),
      setHidden: (v) => set({ hidden: v }),

      openMobile: () => set({ mobileOpen: true }),
      closeMobile: () => set({ mobileOpen: false }),
      toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
    }),
    {
      name: 'itrix.shell',
      storage: createJSONStorage(() => localStorage),
      // Only the durable width preference is persisted.
      partialize: (s) => ({ collapsed: s.collapsed }),
    },
  ),
);
