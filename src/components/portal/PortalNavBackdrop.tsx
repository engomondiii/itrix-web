'use client';

import { usePortalNavStore } from '@/store/portalNavStore';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * The scrim behind the workspace drawer (mobile portrait only).
 *
 * Tapping outside a drawer to dismiss it is the behaviour every phone user already
 * has; without it the only way out is the same small button that opened it. Rendered
 * as a button rather than a div so it is reachable by keyboard and announced, and
 * `lg:hidden` because there is no drawer above that breakpoint.
 *
 * Always mounted, never conditionally rendered: mounting on open would mean the fade
 * has no starting state to transition from, so it would appear instantly.
 */
export function PortalNavBackdrop() {
  const copy = useCommonCopy();
  const open = usePortalNavStore((s) => s.open);
  const closeNav = usePortalNavStore((s) => s.closeNav);

  return (
    <button
      type="button"
      className="portal-nav-backdrop lg:hidden"
      data-open={open ? 'true' : undefined}
      aria-label={copy.closeWorkspaceMenu}
      tabIndex={open ? 0 : -1}
      onClick={closeNav}
    />
  );
}
