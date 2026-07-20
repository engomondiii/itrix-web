'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ARRIVAL_FOOTER } from '@/lib/content/arrivalCopy';

/**
 * The arrival footer — dark ink band with the legal links.
 *
 * RELEASE NOTE, carried forward from Phase 1: /privacy and /security do not
 * exist in this repo. Playbook v1.6 §16D requires all three links and says they
 * are "not permitted to disappear", so rather than ship two 404s an item with a
 * null href is skipped and warned about in development.
 *
 * Create the two routes, set the hrefs in arrivalCopy.ts, and the footer
 * completes itself. "Disclosure policy" points at the same drawer the right rail
 * opens, which already has approved content.
 */
export function ArrivalFooter({ onOpenDisclosure }: { onOpenDisclosure: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const missing = ARRIVAL_FOOTER.links.filter((l) => !l.href && l.label !== 'Disclosure policy');
    if (missing.length > 0) {
      console.warn(
        `[arrival] Legal links not rendered because their routes do not exist: ${missing
          .map((l) => l.label)
          .join(', ')}. Playbook v1.6 §16D requires all three.`,
      );
    }
  }, []);

  return (
    <footer className="arrival-footer">
      <span>{ARRIVAL_FOOTER.copyright}</span>
      <nav aria-label="Legal links">
        {ARRIVAL_FOOTER.links.map((link) =>
          link.label === 'Disclosure policy' ? (
            <button key={link.label} type="button" onClick={onOpenDisclosure}>
              {link.label}
            </button>
          ) : link.href ? (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ) : null,
        )}
      </nav>
    </footer>
  );
}
