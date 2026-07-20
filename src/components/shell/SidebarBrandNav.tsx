'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';
import { SIDEBAR_BRAND_NAV, SIDEBAR_NDA_ACCESS } from '@/config/shellNav.config';

/**
 * Brand, navigation and NDA access — at the top of the sidebar.
 *
 * THIS IS WHERE THE GLOBAL HEADER WENT (Surface 1 v5.0 §00.1 change 8). There is
 * no site header any more: a full-width bar above a conversation is furniture,
 * and it competes with the one thing the visitor came to do.
 *
 * Brand Manual §2.3–2.4: the wordmark renders at ≥120px with clear space equal
 * to the lowercase "i" height, enforced by the padding rather than trusted to a
 * neighbour.
 *
 * NDA access stays quiet and gated. It is never a primary CTA — the composer is
 * the only primary action on this surface (§2.4).
 */
export function SidebarBrandNav() {
  const pathname = usePathname();

  return (
    <div className="sidebar-section sidebar-section--brand">
      <Link
        href={routes.home}
        aria-label={`${brand.name} home`}
        className="flex min-w-[120px] flex-col gap-1 pb-1 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <span className="font-display text-lg font-bold tracking-tight text-ink-primary">
          itri<span className="text-accent">X</span>
        </span>
        <span className="font-mono text-micro uppercase leading-tight tracking-[0.08em] text-ink-secondary">
          Computational AI Infrastructure
        </span>
      </Link>

      <nav aria-label="Primary" className="mt-4 flex flex-col gap-0.5">
        {SIDEBAR_BRAND_NAV.map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className="sidebar-link"
            >
              {item.label}
            </Link>
          ) : null,
        )}

        {SIDEBAR_NDA_ACCESS.href ? (
          <Link href={SIDEBAR_NDA_ACCESS.href} className="sidebar-link sidebar-link--gated mt-1">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            {SIDEBAR_NDA_ACCESS.label}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
