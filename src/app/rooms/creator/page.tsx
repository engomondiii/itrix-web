import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('creator');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('creator') });

export default function CreatorPage() {
  return (
    <>
      <RoomHero roomId="creator" />
      <RoomCTA room={room} />
    </>
  );
}
