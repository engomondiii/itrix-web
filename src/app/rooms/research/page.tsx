import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { ResearchRoomContent } from '@/components/rooms/ResearchRoomContent';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('research');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('research') });

export default function ResearchPage() {
  return (
    <>
      <RoomHero roomId="research" />
      <ResearchRoomContent />
      <RoomCTA room={room} />
    </>
  );
}
