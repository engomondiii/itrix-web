import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { RoomContent } from '@/lib/content/visitorRooms';

export function RoomCTA({ room }: { room: RoomContent }) {
  return (
    <section className="section">
      <div className="container-page">
        <Card variant="default" className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-section text-ink-primary">What you get here</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {room.offers.map((o) => (
                <li key={o} className="flex items-start gap-2 text-secondary text-ink-secondary">
                  <span aria-hidden className="mt-1 text-ink-primary">▪</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link href={room.ctaHref} className="shrink-0">
            <Button variant="primary" size="lg">{room.ctaLabel}</Button>
          </Link>
        </Card>
      </div>
    </section>
  );
}
