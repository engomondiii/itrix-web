'use client';

import Link from 'next/link';
import { useUiStore } from '@/store/uiStore';
import { primaryNav } from '@/config/navigation.config';
import { routes } from '@/constants/routes';
import { brand } from '@/constants/brand';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';

/**
 * The public header (Surface 1 v4.0 §5 Phase 1, approved landing package).
 *
 * Quiet enterprise navigation on the light canvas — NOT a dark marketing bar.
 * The Brand Manual makes the canvas dominant (~70% of every screen) and reserves
 * the dark ink for limited structural moments; a full-width dark header spends
 * that budget on furniture.
 *
 * What changed from v3.x:
 *   · The dark indigo bar becomes a glass surface on the canvas.
 *   · The "Begin Compute Review" button is REMOVED from the header. The primary
 *     action is the composer in the centre — a header CTA competes with it and
 *     pushes before the visitor has spoken (§2.4).
 *   · An "NDA access" affordance replaces it: quiet, gated, and honest about
 *     what it is.
 *   · The wordmark is the approved lockup at ≥120px (96px on mobile) with clear
 *     space equal to the lowercase "i" height (Brand Manual §2.3, §2.4).
 *
 * Still true: no Sign-in link on the public surface (the portal has its own
 * entry), and product detail is pulled through the nav, never pushed.
 */
export function Header() {
  const toggleMenu = useUiStore((s) => s.toggleMobileMenu);
  const menuOpen = useUiStore((s) => s.mobileMenuOpen);

  return (
    <header className="nav-bar">
      <div className="container-page flex h-[var(--shell-nav-h)] items-center justify-between gap-6">
        {/* Wordmark + descriptor. Clear space is enforced by the pr-* padding so
            no nav item can encroach on it. */}
        <Link
          href={routes.home}
          className="flex min-w-[120px] items-center gap-3 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={`${brand.name} home`}
        >
          <span className="font-display text-lg font-bold tracking-tight text-ink-primary">
            itri<span className="text-accent">X</span>
          </span>
          <span className="hidden font-mono text-micro uppercase leading-tight tracking-[0.08em] text-ink-secondary sm:block">
            Computational AI
            <br />
            Infrastructure
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <NavLink href={item.href}>{item.label}</NavLink>
                <div className="invisible absolute left-1/2 top-full z-50 min-w-[200px] -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-base group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-md border border-border-soft bg-surface p-2 shadow-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-sm px-3 py-2 text-secondary text-ink-secondary transition-colors hover:bg-soft hover:text-ink-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={item.label} href={item.href}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* Gated, not pushy: a lock and a plain label. No primary CTA here —
              the composer in the centre is the only primary action. */}
          <Link href={routes.review} className="hidden md:inline-flex">
            <span className="button-secondary inline-flex items-center gap-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              NDA access
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-ink-primary transition-colors hover:bg-soft md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu />
    </header>
  );
}
