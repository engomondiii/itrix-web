'use client';

import { createContext, useContext, useEffect } from 'react';
import { useVisitorStore } from '@/store/visitorStore';
import type { VisitorType, VisitorSession } from '@/types/visitor.types';
import type { RoomId } from '@/types/room.types';

interface VisitorContextValue extends VisitorSession {
  clientId: string | null;
  setVisitorType: (type: VisitorType) => void;
  addRoom: (room: RoomId) => void;
}

const VisitorContext = createContext<VisitorContextValue | null>(null);

/**
 * Bootstraps the anonymous client id on mount and exposes visitor state via
 * context. The backend session (apps.visitors) is created in Phase 3; this
 * provider only holds client-side identity and room history until then.
 */
export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const store = useVisitorStore();

  useEffect(() => {
    store.ensureClientId();
  }, [store]);

  const value: VisitorContextValue = {
    id: store.id,
    createdAt: store.createdAt,
    visitorType: store.visitorType,
    enteredRooms: store.enteredRooms,
    clientId: store.clientId,
    setVisitorType: store.setVisitorType,
    addRoom: store.addRoom,
  };

  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>;
}

export function useVisitor(): VisitorContextValue {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error('useVisitor must be used within a VisitorProvider');
  return ctx;
}
