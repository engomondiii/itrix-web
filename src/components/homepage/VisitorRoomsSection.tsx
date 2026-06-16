import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { RoomEntryCard } from '@/components/rooms/RoomEntryCard';
import { ROOM_LIST } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const FEATURED = ['bottleneck', 'technical', 'investor', 'partner'] as const;

export function VisitorRoomsSection() {
  const rooms = ROOM_LIST.filter((r) => (FEATURED as readonly string[]).includes(r.id));
  return (
    <section className="section border-b border-line bg-surface-warm">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionLabel>Not here for a review? Enter Your Prefered Room.</SectionLabel>
            <h2 className="mt-4 text-web-h2 text-indigo-950">Find the door to the room that fits.</h2>
          </div>
          <Link href={routes.rooms} className="hidden sm:block">
            <Button variant="secondary" size="sm">All rooms</Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <RoomEntryCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}
