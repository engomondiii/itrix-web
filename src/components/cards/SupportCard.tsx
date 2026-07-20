'use client';

import { SupportRequestList } from '@/components/success/SupportRequestList';
import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { InlineCard } from '@/types/artifact.types';
import type { SupportRequest } from '@/types/success.types';

/**
 * Open support requests, in the thread.
 *
 * NEVER SELL INTO A SUPPORT THREAD (Playbook v1.6 §12D):
 *
 *   "A support reply helps with the problem and stops. It does not mention
 *    another workload, an expansion, a renewal, or a next agreement — no matter
 *    how natural the segue seems."
 *
 * That rule is enforced in the backend's claim checker, not by wording here. The
 * structural half is this component: it has no action slot at all. There is
 * nowhere for a commercial call-to-action to be rendered even if one arrived.
 *
 * A customer who wants help types it into the composer, which is directly
 * beneath — they do not have to find the right department.
 */
interface SupportPayload {
  requests?: SupportRequest[];
  slaHours?: number | null;
}

export function SupportCard({ card }: { card: InlineCard }) {
  const p = (card.payload ?? {}) as SupportPayload;
  const requests = p.requests ?? [];

  return (
    <aside className="inline-card inline-card--support" data-card={card.type}>
      <p className="inline-card__title">{card.title || SUCCESS_COPY.support.title}</p>
      <p className="inline-card__body">{card.body || SUCCESS_COPY.support.intro}</p>

      {p.slaHours ? (
        <p className="inline-card__body">
          Your response time is {p.slaHours} hours.
        </p>
      ) : null}

      {requests.length > 0 ? <SupportRequestList requests={requests} /> : null}
    </aside>
  );
}
