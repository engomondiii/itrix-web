import { trackEvent } from './trackEvent';
import type { RoomId } from '@/types/room.types';
import type { VisitorType } from '@/types/visitor.types';

export function trackRoomEntry(input: { roomId: RoomId; visitorType?: VisitorType | null }): void {
  trackEvent('room_entry', { room_id: input.roomId, visitor_type: input.visitorType ?? null });
}
