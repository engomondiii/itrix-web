'use client';

import { DecisionLog } from '@/components/workspace/DecisionLog';
import { CommercialDocumentList } from '@/components/workspace/CommercialDocumentList';
import { useIntegration } from '@/hooks/useIntegration';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';
import { useLocaleStore } from '@/store/localeStore';

/**
 * DECISIONS — what has been agreed, and when.
 *
 * ── WHY THIS IS NOT THE SAME AS `governance` ────────────────────────────────
 * They share a source and differ in what they answer. `decisions` answers *what is
 * still open and what documents are in flight* — it is forward-looking, and it appears
 * from State 7. `governance` answers *what was decided and by whom* — it is the shared
 * record, and it appears from State 9 (§11.6 growth table).
 *
 * Both are read-only. The pane is a reading surface: there is no approve button here
 * and no place for one, because a commercial decision is taken with a named human and
 * recorded afterwards, not clicked in a panel.
 */
export function DecisionsPaneSection() {
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const { data, loading } = useIntegration();
  /* `openDecisions` is what is still open; `documents` is what is in flight. The
     decision LOG — what was already decided — is the `governance` section's job, and
     the field names in IntegrationPayload draw the same line. */
  const decisions = data?.openDecisions ?? [];
  const documents = data?.documents ?? [];
  const empty = decisions.length === 0 && documents.length === 0;

  return (
    <PaneSectionFrame
      section="decisions"
      loading={loading}
      empty={empty}
      emptyMessage={PANE_SECTION_EMPTY.decisions}
    >
      <div className="pane__stack">
        {decisions.length > 0 ? <DecisionLog entries={decisions} title={ko ? '진행 중인 결정' : 'Open decisions'} /> : null}
        {documents.length > 0 ? <CommercialDocumentList documents={documents} /> : null}
      </div>
    </PaneSectionFrame>
  );
}
