'use client';

import { useShellContext } from '@/context/ShellContext';
import { NDA_DRAWER } from '@/lib/content/centerCopy';
import { PANE_SECTION_EMPTY, PANE_COPY, PANE_COPY_KO } from '@/lib/content/paneCopy';
import { useLocaleStore } from '@/store/localeStore';
import { PaneSectionFrame } from './_shared';

/** Plain language for a disclosure ceiling. Never the internal tier name. */
const CEILING_LABEL: Record<string, string> = {
  public: 'Public information only',
  controlled_public: 'Your situation, reflected back — no confidential material yet',
  nda_only: 'Agreement-gated — only explicitly authorized material may be discussed',
  customer_contract: 'Under contract — your assessment, evidence and deployment material',
  internal: 'Internal',
};

/**
 * NDA — protection state and the separate disclosure boundary.
 *
 * ── APPROVED COPY, NOT A CHECKLIST ──────────────────────────────────────────
 * The body is `NDA_DRAWER`, which is legally-signed-off controlled-public wording and
 * lives in exactly one place so a reword is impossible by accident. This section quotes
 * it; it does not paraphrase it.
 *
 * The NDA CHECKLIST CARD stays in the conversation. It carries an action — the next
 * outstanding item — and an action belongs beside a named human, not in a reading
 * panel the visitor can collapse.
 *
 * ── AND THE CEILING IS STATED IN PLAIN LANGUAGE ─────────────────────────────
 * `disclosureCeiling` arrives as an internal-looking token (`nda_only`,
 * `customer_contract`). It is translated here, because a visitor should be able to read
 * what the current server-computed boundary permits without learning our vocabulary — and because showing
 * the raw token would be showing an internal field on a client plane.
 */
export function NdaPaneSection() {
  const paneCopy = useLocaleStore((state) => state.locale) === 'ko' ? PANE_COPY_KO : PANE_COPY;
  const { disclosureCeiling } = useShellContext();

  return (
    <PaneSectionFrame section="nda">
      <div className="pane__stack">
        <p className="pane__note">
          {CEILING_LABEL[disclosureCeiling] ?? PANE_SECTION_EMPTY.nda}
        </p>

        <div className="pane__boundary">
          <p className="pane__boundary-tier">{NDA_DRAWER.tier}</p>
          <h4 className="pane__boundary-title">{NDA_DRAWER.title}</h4>
          <p className="pane__boundary-body">{NDA_DRAWER.body}</p>
        </div>

        <p className="pane__note">{paneCopy.ndaNote}</p>
      </div>
    </PaneSectionFrame>
  );
}
