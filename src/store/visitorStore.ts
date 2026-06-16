import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VisitorType, VisitorSession } from '@/types/visitor.types';
import type { RoomId } from '@/types/room.types';

interface VisitorState extends VisitorSession {
  /** Anonymous client id generated on first visit (distinct from the backend session id). */
  clientId: string | null;
  ensureClientId: () => void;
  setSession: (id: string, createdAt: string) => void;
  setVisitorType: (type: VisitorType) => void;
  addRoom: (room: RoomId) => void;
  reset: () => void;
}

function makeClientId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set, get) => ({
      id: null,
      createdAt: null,
      visitorType: null,
      enteredRooms: [],
      clientId: null,
      ensureClientId: () => {
        if (!get().clientId) set({ clientId: makeClientId() });
      },
      setSession: (id, createdAt) => set({ id, createdAt }),
      setVisitorType: (visitorType) => set({ visitorType }),
      addRoom: (room) =>
        set((s) => (s.enteredRooms.includes(room) ? s : { enteredRooms: [...s.enteredRooms, room] })),
      reset: () => set({ id: null, createdAt: null, visitorType: null, enteredRooms: [] }),
    }),
    { name: 'itrix-visitor' },
  ),
);
