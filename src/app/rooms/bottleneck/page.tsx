import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('bottleneck');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('bottleneck') });

export default function BottleneckPage() {
  return (
    <>
      <RoomHero roomId="bottleneck" />
      <RoomCTA room={room} />
    </>
  );
}
