'use client';

import { DecisionLog } from '@/components/workspace/DecisionLog';
import { useIntegration } from '@/hooks/useIntegration';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';

/**
 * THE DECISION LOG — the shared record of what was decided and by whom.
 *
 * Shared, and therefore append-only in spirit: an entry is not edited to read better
 * later. That is enforced on the backend; what matters here is that the pane offers no
 * affordance that would suggest otherwise.
 */
export function GovernancePaneSection() {
  const { data, loading } = useIntegration();
  const entries = data?.decisionLog ?? [];

  return (
    <PaneSectionFrame
      section="governance"
      loading={loading}
      empty={entries.length === 0}
      emptyMessage={PANE_SECTION_EMPTY.governance}
    >
      <DecisionLog entries={entries} />
    </PaneSectionFrame>
  );
}
