import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('public-infrastructure');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('public-infrastructure') });

export default function PublicInfrastructurePage() {
  return (
    <>
      <RoomHero roomId="public-infrastructure" />
      <RoomCTA room={room} />
    </>
  );
}
