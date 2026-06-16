import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { InvestorBriefingPreview } from '@/components/rooms/InvestorBriefingPreview';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('investor');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('investor') });

export default function InvestorPage() {
  return (
    <>
      <RoomHero roomId="investor" />
      <InvestorBriefingPreview />
      <RoomCTA room={room} />
    </>
  );
}
