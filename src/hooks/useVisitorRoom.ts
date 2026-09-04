'use client';

import { useEffect, useRef } from 'react';
import { useVisitor } from '@/context/VisitorContext';
import { useVisitorStore } from '@/store/visitorStore';
import { getRoom } from '@/lib/content/visitorRooms';
import { roomApi } from '@/lib/api/roomApi';
import { trackRoomEntry } from '@/lib/analytics/trackRoomEntry';
import type { RoomId } from '@/types/room.types';

/**
 * Records a visitor's entry into a room: classifies the session locally (visitor
 * store), tracks the event, and — finalized in Phase 3 — persists the entry to the
 * backend via /api/room/entry, capturing the returned session id. Best-effort.
 */
export function useVisitorRoom(roomId: RoomId) {
  const { addRoom, setVisitorType, enteredRooms, clientId, id } = useVisitor();
  const room = getRoom(roomId);
  const recorded = useRef<RoomId | null>(null);

  useEffect(() => {
    if (recorded.current === roomId) return;
    recorded.current = roomId;

    addRoom(roomId);
    setVisitorType(room.visitorType);
    trackRoomEntry({ roomId, visitorType: room.visitorType });

    const params = new URLSearchParams(window.location.search);
    const referrer = document.referrer || '';
    let sourceChannel = params.get('utm_source') || '';
    if (!sourceChannel && referrer) {
      try {
        const host = new URL(referrer).hostname.toLowerCase();
        sourceChannel = /google|bing|duckduckgo|yahoo/.test(host) ? 'search' : 'referral';
      } catch {
        sourceChannel = 'referral';
      }
    }
    void roomApi
      .recordEntry({
        sessionId: id, clientId, roomId, visitorType: room.visitorType,
        landingPath: `${window.location.pathname}${window.location.search}`,
        sourceChannel: sourceChannel || 'direct',
        campaignContent: params.get('utm_content') || params.get('utm_campaign') || '',
        referralOrIntro: referrer,
      })
      .then((res) => {
        if (res.data?.sessionId) {
          useVisitorStore.getState().setSession(res.data.sessionId, new Date().toISOString());
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return { room, enteredRooms };
}
