import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { PartnershipRoomContent } from '@/components/rooms/PartnershipRoomContent';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('partner');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('partner') });

export default function PartnerPage() {
  return (
    <>
      <RoomHero roomId="partner" />
      <PartnershipRoomContent />
      <RoomCTA room={room} />
    </>
  );
}
