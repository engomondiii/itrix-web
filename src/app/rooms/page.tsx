import { PageWrapper } from '@/components/layout/PageWrapper';
import { RoomEntryCard } from '@/components/rooms/RoomEntryCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { ROOM_LIST, ROOM_GROUP_LABEL } from '@/lib/content/visitorRooms';
import type { RoomGroup } from '@/types/room.types';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Find your room',
  description: 'Ten ways into iTrix — choose the one that fits why you are here.',
  path: routes.rooms,
});

const GROUP_ORDER: RoomGroup[] = ['operator', 'technical', 'capital', 'communications', 'orientation'];

export default function RoomsPage() {
  return (
    <PageWrapper eyebrow="Visitor rooms" title="Why are you here?" grid
      lead="Pick the door that fits. Each room routes you to the right material — and the site quietly learns how to follow up well.">
      <div className="flex flex-col gap-12">
        {GROUP_ORDER.map((group) => {
          const rooms = ROOM_LIST.filter((r) => r.group === group);
          if (rooms.length === 0) return null;
          return (
            <div key={group}>
              <SectionLabel>{ROOM_GROUP_LABEL[group]}</SectionLabel>
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <RoomEntryCard key={room.id} room={room} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
