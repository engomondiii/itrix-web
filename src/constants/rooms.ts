import type { RoomId, RoomGroup } from '@/types/room.types';

/**
 * The 13-room registry (Playbook Part V). A lightweight, dependency-free list of the
 * room ids + their slugs and group, kept separate from the rich content in
 * lib/content/visitorRooms.ts so links, sitemaps, and static params can enumerate
 * rooms without importing the full content module.
 */
export const ROOM_IDS: RoomId[] = [
  'bottleneck',
  'technical-assessment',
  'technical',
  'research',
  'architecture',
  'investor',
  'partner',
  'shareholder',
  'public-infrastructure',
  'sustainable-ai',
  'media',
  'story',
  'orientation',
];

/** slug === id for every room (kept explicit for clarity + future divergence). */
export const ROOM_SLUGS: string[] = [...ROOM_IDS];

export const ROOM_GROUP_ORDER: RoomGroup[] = [
  'operator',
  'technical',
  'capital',
  'communications',
  'orientation',
];
