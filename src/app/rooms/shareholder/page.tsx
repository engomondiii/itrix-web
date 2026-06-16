import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('shareholder');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('shareholder') });

export default function ShareholderPage() {
  return (
    <>
      <RoomHero roomId="shareholder" />
      <RoomCTA room={room} />
    </>
  );
}
