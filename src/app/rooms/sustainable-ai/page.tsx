import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('sustainable-ai');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('sustainable-ai') });

export default function SustainableAiPage() {
  return (
    <>
      <RoomHero roomId="sustainable-ai" />
      <RoomCTA room={room} />
    </>
  );
}
