/** Visitor Rooms — 10 entry points grouped by persona family (Surface 1). */

export type RoomId =
  | 'bottleneck'
  | 'technical'
  | 'research'
  | 'investor'
  | 'partner'
  | 'shareholder'
  | 'media'
  | 'creator'
  | 'public-infrastructure'
  | 'explore';

export type RoomGroup = 'operator' | 'technical' | 'capital' | 'communications' | 'orientation';

export interface Room {
  id: RoomId;
  slug: string; // path segment under /rooms
  title: string; // display heading
  label: string; // short nav label
  summary: string; // one-line description
  group: RoomGroup;
}
