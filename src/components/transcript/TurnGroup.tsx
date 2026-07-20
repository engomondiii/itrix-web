'use client';

import { UserTurn } from './UserTurn';
import { StreamingTurn } from './StreamingTurn';
import type { Turn } from '@/types/thread.types';

/**
 * Renders one turn by role.
 *
 * It exists so the transcript never branches inline. PHASE 2 points the itriX
 * side at StreamingTurn, which owns every governance state a turn can be in —
 * provisional, under review, halted, settled or unavailable.
 */
export function TurnGroup({ turn }: { turn: Turn }) {
  return turn.role === 'visitor' ? <UserTurn turn={turn} /> : <StreamingTurn turn={turn} />;
}
