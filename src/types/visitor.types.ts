import type { RoomId } from './room.types';

/** Visitor classification mirrors backend apps.visitors.VisitorSession. */
export type VisitorType =
  | 'technical'
  | 'strategic'
  | 'investor'
  | 'media'
  | 'partner'
  | 'researcher'
  | 'creator'
  | 'shareholder'
  | 'public_infrastructure'
  | 'general';

export interface VisitorSession {
  /** Backend session UUID (null until a session is created in Phase 3). */
  id: string | null;
  createdAt: string | null;
  visitorType: VisitorType | null;
  enteredRooms: RoomId[];
}
