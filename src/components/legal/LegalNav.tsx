import Link from 'next/link';
import { LEGAL_INSTRUMENTS } from '@/lib/content/legalCopy';

/**
 * Navigation between the four instruments.
 *
 * They cross-reference each other constantly — the Terms point at the Privacy Policy
 * for data handling and at the Security Statement for controls; the Disclosure Policy
 * is what the Terms' confidentiality clause is describing. A reader who arrives at one
 * of them usually needs a second, so all four are one click apart from all four.
 */
export function LegalNav({ current }: { current: string }) {
  return (
    <nav className="legal-nav" aria-label="Legal instruments">
      <ul>
        {LEGAL_INSTRUMENTS.map((instrument) => (
          <li key={instrument.slug}>
            <Link
              href={`/${instrument.slug}`}
              aria-current={instrument.slug === current ? 'page' : undefined}
              className="legal-nav__link"
            >
              {instrument.navLabel}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
