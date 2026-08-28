import { PageWrapper } from '@/components/layout/PageWrapper';
import { LocalizedText } from '@/components/i18n/LocalizedText';
import { RoomEntryCard } from '@/components/rooms/RoomEntryCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { ROOM_LIST, ROOM_GROUP_LABEL } from '@/lib/content/visitorRooms';
import { ROOM_GROUP_LABEL_KO } from '@/lib/i18n/roomsLocale';
import { ROOM_GROUP_ORDER } from '@/constants/rooms';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Find your room',
  description: 'Thirteen ways into itriX — choose the one that fits why you are here.',
  path: routes.rooms,
});

export default function RoomsPage() {
  return (
    <PageWrapper
      eyebrow={<LocalizedText en="Visitor rooms" ko="방문자 룸" />}
      title={<LocalizedText en="Why are you here?" ko="무엇을 위해 오셨나요?" />}
      grid
      lead={<LocalizedText en="Choose the room that best matches your purpose. A room is an information destination, not a customer classification or commercial decision." ko="방문 목적에 가장 맞는 룸을 선택하세요. 룸은 정보 목적지이며 고객 분류나 상업적 결정이 아닙니다." />}
    >
      <div className="flex flex-col gap-12">
        {ROOM_GROUP_ORDER.map((group) => {
          const rooms = ROOM_LIST.filter((r) => r.group === group);
          if (rooms.length === 0) return null;
          return (
            <div key={group}>
              <SectionLabel><LocalizedText en={ROOM_GROUP_LABEL[group]} ko={ROOM_GROUP_LABEL_KO[group]} /></SectionLabel>
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
