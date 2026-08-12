'use client';

import Link from 'next/link';
import { ItrixLogo } from '@/components/brand/ItrixLogo';
import { usePortalNavStore } from '@/store/portalNavStore';
import { usePortalStore } from '@/store/portalStore';
import { routes } from '@/constants/routes';

/**
 * THE WORKSPACE MOBILE BAR — PORTRAIT ONLY (2026-08-12).
 *
 * Named `PortalMobileBar`, NOT `PortalTopBar`: `PortalTopbar` (lowercase b) already
 * exists and is a per-screen title header used by nine pages. Two files differing only
 * in casing resolve to ONE file on Windows and macOS, so the two components would have
 * overwritten each other on the very machine this ships to. tsc caught it; the name is
 * now distinct rather than merely differently cased.
 *
 * ── WHAT WAS BROKEN ─────────────────────────────────────────────────────────
 * `PortalSidebar` was a fixed `w-60 h-dvh` column with no responsive rule of any
 * kind. On a 390px phone that is 240px — well over half the screen — spent on
 * navigation, permanently, on every workspace screen. The content beside it was
 * squeezed into ~150px, which is why messaging, documents and settings were all
 * reported as unusable in portrait rather than any one of them.
 *
 * So on small screens the sidebar becomes a drawer and this bar is what remains:
 * a menu button, the mark, and the unread count. Above `lg` this component does not
 * render at all and the sidebar is exactly as it was — the desktop workspace is
 * untouched by this change.
 *
 * ── THE BADGE IS ON THE BUTTON FOR A REASON ─────────────────────────────────
 * With the nav closed, an unread reply from the itriX team has nowhere to announce
 * itself. Putting the count on the control that opens the nav means the one thing a
 * customer must not miss is visible while the thing that would show it is hidden.
 */
export function PortalMobileBar() {
  const toggleNav = usePortalNavStore((s) => s.toggleNav);
  const open = usePortalNavStore((s) => s.open);
  const unread = usePortalStore((s) => s.unreadMessages);

  return (
    <header className="portal-topbar lg:hidden">
      <button
        type="button"
        className="portal-topbar__menu"
        aria-label={open ? 'Close workspace menu' : 'Open workspace menu'}
        aria-expanded={open}
        aria-controls="portal-sidebar"
        onClick={toggleNav}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
        {unread > 0 && !open ? (
          <span className="portal-topbar__dot" aria-hidden="true" />
        ) : null}
      </button>

      <Link href={routes.workspaceOverview} className="portal-topbar__mark" aria-label="itriX workspace">
        <ItrixLogo width={92} priority />
      </Link>

      {/* Balances the row so the mark sits centred, and carries the count in words for
          assistive tech — the dot above is decorative and announces nothing. */}
      <span className="portal-topbar__count">
        {unread > 0 ? <span className="sr-only">{unread} unread messages</span> : null}
      </span>
    </header>
  );
}
