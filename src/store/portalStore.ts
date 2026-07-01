import { create } from 'zustand';
import type { ClientIdentity } from '@/types/portal.types';

interface PortalState {
  client: ClientIdentity | null;
  unreadMessages: number;
  /** Names of team members present in the active conversation (presence). */
  presentTeam: string[];
  setClient: (client: ClientIdentity | null) => void;
  setUnread: (count: number) => void;
  setPresentTeam: (names: string[]) => void;
  reset: () => void;
}

/**
 * Lightweight portal session state (NOT the token — that lives in an httpOnly
 * cookie, server-side only). Holds the resolved client profile, unread count, and
 * presence for the messages screen.
 */
export const usePortalStore = create<PortalState>()((set) => ({
  client: null,
  unreadMessages: 0,
  presentTeam: [],
  setClient: (client) => set({ client }),
  setUnread: (unreadMessages) => set({ unreadMessages }),
  setPresentTeam: (presentTeam) => set({ presentTeam }),
  reset: () => set({ client: null, unreadMessages: 0, presentTeam: [] }),
}));
