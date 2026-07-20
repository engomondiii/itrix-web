'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DrawerGroup } from '@/components/drawers/DrawerGroup';
import { SIDEBAR_EXPLORE } from '@/config/shellNav.config';
import { SIDEBAR_COPY } from '@/lib/content/composerCopy';

/**
 * Explore itriX — the marketing routes, the 13 visitor rooms and the seven
 * closed-by-default drawers, relocated from below the landing fold.
 *
 * R5 IS PRESERVED, and that is the point of this component. Public information is
 * still exposed only through closed-by-default, pulled-not-pushed disclosure, and
 * opening a drawer is still a logged visitor action. Only the entry point moved:
 * the landing now stops at the example prompts (R29), so this group is how a
 * visitor reaches everything that used to be a scroll away.
 *
 * The group itself is collapsed by default. Someone who came to describe a
 * bottleneck should not have a product menu open in their peripheral vision.
 */
export function ExploreGroup() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sidebar-section">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="sidebar-explore"
        className="sidebar-section__toggle"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{SIDEBAR_COPY.exploreLabel}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform duration-base ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div id="sidebar-explore" hidden={!open} className="sidebar-explore">
        {SIDEBAR_EXPLORE.map((group) => (
          <div key={group.title} className="sidebar-explore__group">
            <p className="sidebar-explore__title">{group.title}</p>
            <ul>
              {group.items.map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <Link href={item.href} className="sidebar-link sidebar-link--sub">
                      {item.label}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ))}

        {/* The seven approved drawers, unchanged in content and still closed by
            default. They are rendered here rather than duplicated. */}
        <div className="sidebar-explore__drawers">
          <DrawerGroup />
        </div>
      </div>
    </div>
  );
}
