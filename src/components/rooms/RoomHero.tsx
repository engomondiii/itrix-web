'use client';

import { useVisitorRoom } from '@/hooks/useVisitorRoom';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BackgroundGrid } from '@/components/visual/BackgroundGrid';
import type { RoomId } from '@/types/room.types';

/** Renders a room's hero and records the visit (classifies the session by persona). */
export function RoomHero({ roomId }: { roomId: RoomId }) {
  const { room } = useVisitorRoom(roomId);
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      <BackgroundGrid />
      <div className="container-page relative py-16">
        <SectionLabel>{room.audience}</SectionLabel>
        <h1 className="mt-4 max-w-3xl text-web-h1 text-indigo-950">{room.title}</h1>
        <p className="reading mt-4 text-web-lead text-ink-700">{room.intro}</p>
      </div>
    </section>
  );
}
