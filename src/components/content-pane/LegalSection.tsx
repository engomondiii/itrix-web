'use client';

import Link from 'next/link';
import { LEGAL_INSTRUMENTS } from '@/lib/content/legalCopy';
import { PANE_SECTION_LABEL } from '@/lib/content/paneCopy';

/**
 * THE FOUR LEGAL INSTRUMENTS, in the home Architecture v2.7 §2.4 specifies.
 *
 * ── THIS IS WHAT PHASE 1'S INTERIM WAS WAITING FOR ──────────────────────────
 * The instruments are "not permitted to disappear at any width". On the arrival
 * route they sit in the pinned legal strip. Once a thread exists they belong here —
 * but the pane did not exist in Phase 1, so `LegalStrip` was mounted in the
 * conversation rail's footer as an explicitly-marked interim.
 *
 * PHASE 2 KEEPS BOTH, deliberately. The rail footer is still the only route to them
 * when the pane is collapsed, when the visitor is below 1024px and has not opened
 * the sheet, or when no pane section is renderable. Removing the strip now would
 * make the instruments reachable only through a panel the visitor can close, which
 * is exactly what §2.4 forbids. The duplication is the correct reading of the rule.
 *
 * Each instrument shows its VERSION, because the assent record stores versions
 * rather than a boolean — so a reader can always quote back what they agreed to
 * (§19.10).
 */
export function LegalSection() {
  return (
    <div className="pane__section" data-section="legal">
      <h3 className="pane__section-title">{PANE_SECTION_LABEL.legal}</h3>

      <ul className="pane__legal">
        {LEGAL_INSTRUMENTS.map((instrument) => (
          <li key={instrument.slug}>
            <Link href={`/${instrument.slug}`} className="pane__legal-link">
              <span className="pane__legal-title">{instrument.title}</span>
              <span className="pane__legal-version">
                Version {instrument.version} · effective {instrument.effective}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
