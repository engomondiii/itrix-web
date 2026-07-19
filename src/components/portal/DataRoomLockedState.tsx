import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { routes } from '@/constants/routes';

/**
 * The NDA-gated data room in its LOCKED state (§65). Framed as a normal,
 * trust-building step — not a wall. "Arrange an NDA" routes into messages.
 */
export function DataRoomLockedState() {
  return (
    <Card variant="warm" className="flex flex-col gap-3">
      <SectionLabel tone="gold">{PORTAL_COPY.documents.dataRoomLocked.heading}</SectionLabel>
      <p className="reading text-ink-secondary">{PORTAL_COPY.documents.dataRoomLocked.body}</p>
      <div className="pt-1">
        <Link href={routes.workspaceMessages}>
          <Button variant="gold" size="md">
            {PORTAL_COPY.documents.dataRoomLocked.button}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
