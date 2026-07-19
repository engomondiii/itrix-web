import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { routes } from '@/constants/routes';
import type { RoomContent } from '@/lib/content/visitorRooms';

export function RoomEntryCard({ room }: { room: RoomContent }) {
  return (
    <Link href={routes.room(room.slug)} className="block h-full">
      <Card variant="default" interactive className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-card-title text-structure-900">{room.title}</h3>
          <Tag>{room.label}</Tag>
        </div>
        <p className="text-secondary text-ink-secondary">{room.summary}</p>
        <span className="mt-auto pt-2 text-secondary text-ink-primary">Enter →</span>
      </Card>
    </Link>
  );
}
