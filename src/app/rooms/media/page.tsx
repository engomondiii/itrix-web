import { RoomHero } from '@/components/rooms/RoomHero';
import { RoomCTA } from '@/components/rooms/RoomCTA';
import { MediaKitPreview } from '@/components/rooms/MediaKitPreview';
import { buildMetadata } from '@/components/seo/PageMeta';
import { getRoom } from '@/lib/content/visitorRooms';
import { routes } from '@/constants/routes';

const room = getRoom('media');
export const metadata = buildMetadata({ title: room.title, description: room.summary, path: routes.room('media') });

export default function MediaPage() {
  return (
    <>
      <RoomHero roomId="media" />
      <MediaKitPreview />
      <RoomCTA room={room} />
    </>
  );
}
