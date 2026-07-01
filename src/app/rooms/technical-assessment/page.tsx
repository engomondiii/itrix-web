import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('technical-assessment');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('technical-assessment') });

export default function TechnicalAssessmentPage() {
  return (
    <>
      <RoomHero roomId="technical-assessment" />
      <RoomCTA room={room} />
    </>
  );
}
