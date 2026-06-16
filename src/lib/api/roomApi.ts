import { postJson } from './reviewApi';
import type { RoomId } from '@/types/room.types';
import type { VisitorType } from '@/types/visitor.types';

export interface RoomEntryRequest {
  sessionId: string | null;
  clientId?: string | null;
  roomId: RoomId;
  visitorType?: VisitorType | null;
}
export interface RoomEntryResponse {
  sessionId: string | null;
}

export const roomApi = {
  recordEntry: (req: RoomEntryRequest) => postJson<RoomEntryResponse>('/api/room/entry', req),
};
