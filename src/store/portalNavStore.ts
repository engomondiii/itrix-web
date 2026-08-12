import { create } from 'zustand';

/**
 * Whether the workspace navigation drawer is open (mobile portrait only).
 *
 * ── WHY A STORE AND NOT LOCAL STATE ─────────────────────────────────────────
 * Three components need the same answer and none of them contains the others:
 * `PortalTopBar` toggles it, `PortalSidebar` renders against it, and the backdrop
 * closes it. Lifting it into `PortalShell` as props would work today and would put a
 * layout concern into a component whose only job is composition.
 *
 * Deliberately NOT persisted. A drawer that is open on arrival because it was open
 * last week is a surprise, and on a phone it would cover the screen the visitor
 * navigated to.
 *
 * Above the `lg` breakpoint the sidebar is permanently visible and this state is
 * simply unread — there is no desktop behaviour to get wrong.
 */
interface PortalNavState {
  open: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
}

export const usePortalNavStore = create<PortalNavState>((set) => ({
  open: false,
  openNav: () => set({ open: true }),
  closeNav: () => set({ open: false }),
  toggleNav: () => set((s) => ({ open: !s.open })),
}));
