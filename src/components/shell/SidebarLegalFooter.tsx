'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { DISCLOSURE_DRAWER_ID, SIDEBAR_LEGAL } from '@/config/shellNav.config';
import { useInfoDrawer } from '@/hooks/useInfoDrawer';
import { getDrawer } from '@/lib/content/infoDrawers';

/**
 * Privacy · Security · Disclosure policy — the sidebar footer.
 *
 * These moved out of the retired site footer and they are NOT PERMITTED TO
 * DISAPPEAR (Playbook v1.6 §16D, Surface 1 v5.0 §2.4).
 *
 * RELEASE NOTE: /privacy and /security do not exist in this repo yet. Shipping
 * two 404s would be worse than showing fewer links, so an item with a null href
 * is skipped and warned about in development. Create the routes, set the hrefs
 * in shellNav.config.tsx, and the footer completes itself.
 *
 * "Disclosure policy" already has approved content, so it opens the
 * before-an-NDA drawer rather than pointing at a route that does not exist.
 */
export function SidebarLegalFooter() {
  const drawer = getDrawer(DISCLOSURE_DRAWER_ID);
  const { open, toggle } = useInfoDrawer(DISCLOSURE_DRAWER_ID, drawer?.title ?? 'Disclosure policy');

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const missing = SIDEBAR_LEGAL.filter((i) => !i.href).map((i) => i.label);
    if (missing.length > 0) {
      console.warn(
        `[sidebar] Legal links not rendered because their routes do not exist: ${missing.join(', ')}. ` +
          'Playbook v1.6 §16D requires all three. Create the routes and set the hrefs in shellNav.config.tsx.',
      );
    }
  }, []);

  return (
    <div className="sidebar-legal">
      <ul className="sidebar-legal__links">
        {SIDEBAR_LEGAL.map((item) =>
          item.href ? (
            <li key={item.label}>
              <Link href={item.href} className="sidebar-legal__link">
                {item.label}
              </Link>
            </li>
          ) : null,
        )}
        <li>
          <button
            type="button"
            className="sidebar-legal__link"
            aria-expanded={open}
            aria-controls="sidebar-disclosure"
            onClick={toggle}
          >
            Disclosure policy
          </button>
        </li>
      </ul>

      <div id="sidebar-disclosure" hidden={!open} className="sidebar-legal__drawer">
        <p>{drawer?.body}</p>
      </div>
    </div>
  );
}
