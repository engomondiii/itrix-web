'use client';

import { SatisfactionPulse } from '@/components/success/SatisfactionPulse';
import type { InlineCard } from '@/types/artifact.types';

/**
 * The private feedback pulse, in the thread.
 *
 * THREE PRIVACY PROPERTIES, all inherited from the existing component and all
 * deliberate (Playbook v1.6 §12I, Surface 1 v4.0 Phase 3):
 *
 *   1. It is WRITE-ONLY. There is no endpoint to read a pulse back, so a score
 *      cannot be rendered to the customer even by mistake.
 *   2. The score is NEVER sent to analytics. Telemetry records that a pulse
 *      happened and whether follow-up was requested — never the value.
 *   3. It rates US, not them. "How is this going for you right now?" is a
 *      question about our service; a pulse is never shown back as a judgement
 *      about the customer.
 *
 * It goes to the customer-success owner and nowhere else.
 */
export function SatisfactionPulseCard({ card }: { card: InlineCard }) {
  return (
    <aside className="inline-card inline-card--pulse" data-card={card.type}>
      <SatisfactionPulse />
      {card.body ? <p className="inline-card__body">{card.body}</p> : null}
    </aside>
  );
}
