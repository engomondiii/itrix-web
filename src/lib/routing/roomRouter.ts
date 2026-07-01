import type { VisitorType } from '@/types/visitor.types';
import type { RoomId } from '@/types/room.types';

/** Maps a classified visitor type to its most relevant room (13-room set). */
const TYPE_TO_ROOM: Record<VisitorType, RoomId> = {
  technical: 'technical',
  strategic: 'bottleneck',
  investor: 'investor',
  media: 'media',
  partner: 'partner',
  researcher: 'research',
  creator: 'story',
  shareholder: 'shareholder',
  public_infrastructure: 'public-infrastructure',
  general: 'orientation',
};

export function recommendRoom(type: VisitorType | null): RoomId {
  return type ? TYPE_TO_ROOM[type] : 'orientation';
}
