'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ItrixLogo } from '@/components/brand/ItrixLogo';
import { ARRIVAL_NAV } from '@/lib/content/arrivalCopy';

/**
 * The arrival header — from the approved landing package.
 *
 * It exists ONLY on the arrival screen. The moment the visitor speaks, the
 * conversation shell takes over and the header's contents live in the sidebar
 * instead (Surface 1 v5.0 §00.1 change 8). That is the reconciliation: the
 * approved landing keeps its header, and the working surface does not carry one.
 *
 * Quiet enterprise navigation on the light canvas, not a dark marketing bar. The
 * primary action is the composer in the centre — "NDA access" is deliberately a
 * secondary button, gated and honest about what it is.
 */
export function ArrivalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="arrival-nav" aria-label="Primary navigation">
      <div className="arrival-nav__inner">
        <Link href="/" className="arrival-brand" aria-label="itriX home">
          <ItrixLogo width={120} priority />
          <span className="arrival-brand__descriptor">
            {ARRIVAL_NAV.descriptor[0]}
            <br />
            {ARRIVAL_NAV.descriptor[1]}
          </span>
        </Link>

        <nav className="arrival-nav__links" aria-label="Site links">
          {ARRIVAL_NAV.links.map((item) => (
            <Link key={item.label} href={item.href} className="arrival-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href={ARRIVAL_NAV.gated.href} className="arrival-button-secondary arrival-nav__gated">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          {ARRIVAL_NAV.gated.label}
        </Link>

        <button
          type="button"
          className="arrival-nav__menu"
          aria-expanded={menuOpen}
          aria-controls="arrival-mobile-menu"
          aria-label={menuOpen ? ARRIVAL_NAV.closeMenu : ARRIVAL_NAV.openMenu}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <div id="arrival-mobile-menu" className="arrival-nav__mobile" hidden={!menuOpen}>
        {ARRIVAL_NAV.links.map((item) => (
          <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href={ARRIVAL_NAV.gated.href} onClick={() => setMenuOpen(false)}>
          {ARRIVAL_NAV.gated.label}
        </Link>
      </div>
    </header>
  );
}
