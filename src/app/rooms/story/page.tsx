import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { StoryKitPreview } from '@/components/rooms/StoryKitPreview';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('story');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('story') });

export default function StoryPage() {
  return (
    <>
      <RoomHero roomId="story" />
      <div className="container-page py-8">
        <StoryKitPreview />
      </div>
      <RoomCTA room={room} />
    </>
  );
}
