import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('technical');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('technical') });

export default function TechnicalPage() {
  return (
    <>
      <RoomHero roomId="technical" />
      <RoomCTA room={room} />
    </>
  );
}
