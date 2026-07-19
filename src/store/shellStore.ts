import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Rail presentation state (Surface 1 v4.0 §3.2).
 *
 * The v3.1 store owned a collapsible NAVIGATION sidebar. v4.0 replaces that with
 * two relationship rails whose CONTENT is decided by the backend, so this store
 * shrinks to what it should always have been: local UI preference, and nothing
 * that could change what a visitor is allowed to see.
 *
 *   leftCollapsed / rightCollapsed — desktop: collapse a rail to its edge.
 *   mobileRail                     — which rail is showing as a sheet on small
 *                                    screens: 'context' (left), 'next' (right),
 *                                    or null (the centre, the default).
 *
 * The collapse preference is persisted so a returning visitor keeps their chosen
 * layout. The mobile sheet is deliberately NOT persisted — it is transient, and
 * a customer should land on their work, not on a panel they left open.
 *
 * IMPORTANT: nothing here may ever gate content. Collapsing a rail hides it
 * visually; it never removes a section from the authorized list, and a collapsed
 * rail stays reachable by keyboard (Surface 1 v4.0 §7.4).
 */
export type MobileRail = 'context' | 'next' | null;

interface ShellState {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  mobileRail: MobileRail;

  toggleLeft: () => void;
  toggleRight: () => void;
  setLeftCollapsed: (v: boolean) => void;
  setRightCollapsed: (v: boolean) => void;

  openMobileRail: (rail: Exclude<MobileRail, null>) => void;
  closeMobileRail: () => void;
}

export const useShellStore = create<ShellState>()(
  persist(
    (set) => ({
      leftCollapsed: false,
      rightCollapsed: false,
      mobileRail: null,

      toggleLeft: () => set((s) => ({ leftCollapsed: !s.leftCollapsed })),
      toggleRight: () => set((s) => ({ rightCollapsed: !s.rightCollapsed })),
      setLeftCollapsed: (v) => set({ leftCollapsed: v }),
      setRightCollapsed: (v) => set({ rightCollapsed: v }),

      openMobileRail: (rail) => set({ mobileRail: rail }),
      closeMobileRail: () => set({ mobileRail: null }),
    }),
    {
      name: 'itrix.shell',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ leftCollapsed: s.leftCollapsed, rightCollapsed: s.rightCollapsed }),
      // v3.1 persisted { collapsed, hidden, mobileOpen } under this key. Drop it.
      version: 2,
      migrate: () => ({ leftCollapsed: false, rightCollapsed: false }),
    },
  ),
);
