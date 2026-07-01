/** Visitor Rooms — 13 entry points grouped by persona family (Surface 1, Playbook Part V). */

export type RoomId =
  | 'bottleneck'
  | 'technical'
  | 'technical-assessment'
  | 'research'
  | 'investor'
  | 'partner'
  | 'shareholder'
  | 'media'
  | 'story'
  | 'public-infrastructure'
  | 'sustainable-ai'
  | 'architecture'
  | 'orientation';

export type RoomGroup = 'operator' | 'technical' | 'capital' | 'communications' | 'orientation';

export interface Room {
  id: RoomId;
  slug: string; // path segment under /rooms
  title: string; // display heading
  label: string; // short nav label
  summary: string; // one-line description
  group: RoomGroup;
}
