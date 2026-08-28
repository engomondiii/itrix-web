'use client';

import Link from 'next/link';
import { LEGAL_INSTRUMENTS } from '@/lib/content/legalCopy';
import { useCommonCopy } from '@/lib/i18n/commonLocale';
import { useLocaleStore } from '@/store/localeStore';
import { LEGAL_INSTRUMENTS_KO } from '@/lib/i18n/legalKo';

/**
 * The four legal instruments — Terms · Privacy · Security · Disclosure policy.
 *
 * ── WHY THIS IS NOT A FOOTER ────────────────────────────────────────────────
 * On the arrival route it is ONE NON-SCROLLING ROW pinned to the bottom edge of
 * the first viewport. R29 forbids scrollable NARRATIVE below the prompts; it has
 * never permitted the legal instruments to be unreachable (§2.4), and with the
 * rails gone from arrival this row is the only place they can live.
 *
 * ── THE `rail` VARIANT IS AN INTERIM, AND SAYS SO ───────────────────────────
 * Architecture v2.7 §2.4 puts these in the content pane's `legal` section once a
 * thread exists. The content pane is PHASE 2. Between now and then, the working
 * shell would have no route to the four instruments at all — and they are "not
 * permitted to disappear at any width".
 *
 * So Phase 1 renders them at the foot of the conversation rail. That does not
 * breach the rail's no-marketing rule: a legal instrument is not a product page.
 * PHASE 2 MOVES THIS INTO ContentPane's LegalSection and deletes the variant.
 *
 * It renders every instrument unconditionally. Phase 1 creates all four routes,
 * which is what CLEARS THE v5.0 RELEASE BLOCKER — the null-href skipping and the
 * development warning that stood in for the two missing pages are gone with it.
 */
export function LegalStrip({ variant = 'arrival' }: { variant?: 'arrival' | 'rail' }) {
  const copy = useCommonCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  return (
    <nav className="legal-strip" data-variant={variant} aria-label={copy.legalAndPolicy}>
      <ul>
        {LEGAL_INSTRUMENTS.map((instrument) => (
          <li key={instrument.slug}>
            <Link href={`/${instrument.slug}`} className="legal-strip__link">
              {ko ? LEGAL_INSTRUMENTS_KO[instrument.slug].navLabel : instrument.navLabel}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
