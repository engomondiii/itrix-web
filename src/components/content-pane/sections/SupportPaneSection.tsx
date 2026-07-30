'use client';

import { SupportRequestList } from '@/components/success/SupportRequestList';
import { useSupport } from '@/hooks/useSupport';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';

/**
 * SUPPORT — the customer's open requests.
 *
 * ── READ-ONLY, AND THAT IS THE POINT ────────────────────────────────────────
 * The pane shows the queue. OPENING a request happens in the conversation, through the
 * composer — because a support request is a message to a named human, and the
 * composer is where messages to humans are written on this surface. Putting a support
 * composer in the pane would create a second place to ask for help, one of which the
 * visitor can collapse.
 *
 * ── AND NOTHING COMMERCIAL, EVER, BESIDE A REQUEST ──────────────────────────
 * A support question is never answered with a commercial reply. That rule is enforced
 * in the backend claim checker, and it matters structurally here too: `SupportCard`
 * was shipped in v5.0 with NO ACTION SLOT AT ALL, so there is nowhere for an offer to
 * be attached to something that is hurting. This section inherits that by mounting the
 * shipped list rather than composing its own rows.
 */
export function SupportPaneSection() {
  const { requests, loading } = useSupport();

  return (
    <PaneSectionFrame
      section="support"
      loading={loading}
      empty={requests.length === 0}
      emptyMessage={PANE_SECTION_EMPTY.support}
    >
      <SupportRequestList requests={requests} />
    </PaneSectionFrame>
  );
}
