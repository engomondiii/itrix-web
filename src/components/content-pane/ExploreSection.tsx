'use client';

import Link from 'next/link';
import { DrawerGroup } from '@/components/drawers/DrawerGroup';
import { SIDEBAR_EXPLORE } from '@/config/shellNav.config';
import { PANE_SECTION_LABEL } from '@/lib/content/paneCopy';

/**
 * EXPLORE — the marketing routes, the 13 visitor rooms and the closed-by-default
 * drawers, in their third home.
 *
 * ── WHERE THIS CONTENT HAS BEEN, AND WHY IT KEEPS MOVING ────────────────────
 * v5.0 moved it out from below the landing fold into the sidebar. v6.0 removed the
 * sidebar's marketing content and the arrival screen's navigation entirely, so it
 * lands here — in the pane, reachable once a thread exists (Architecture v2.7 §2.4).
 *
 * R5 IS PRESERVED THROUGHOUT, and that is the point of the relocations rather than
 * deletions: public information is exposed only through closed-by-default,
 * pulled-not-pushed disclosure, and opening a drawer is still a logged visitor
 * action. Only the entry point has moved.
 *
 * ── THE CONSEQUENCE WORTH REMEMBERING ───────────────────────────────────────
 * A first-time visitor who does not type cannot reach any of this from `/`. That is
 * the direct result of removing the arrival navigation, it is recorded in
 * Architecture v2.7 §00.2 as a marketing-reach decision needing sign-off, and it is
 * the reason every route below stays live and in the sitemap.
 *
 * `Approach` is not here, and is retired as a navigation label on every surface. Its
 * page still exists and is still findable by search.
 *
 * This component REUSES the shipped ExploreGroup's data and the shipped DrawerGroup
 * rather than re-implementing either. Two copies of the drawer list is how one of
 * them stops being closed by default.
 */
export function ExploreSection() {
  return (
    <div className="pane__section" data-section="explore">
      <h3 className="pane__section-title">{PANE_SECTION_LABEL.explore}</h3>

      {SIDEBAR_EXPLORE.map((group) => (
        <div key={group.title} className="pane__explore-group">
          <p className="pane__explore-title">{group.title}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="pane__explore-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* The approved drawers, unchanged in content and still closed by default. */}
      <div className="pane__drawers">
        <DrawerGroup />
      </div>
    </div>
  );
}
