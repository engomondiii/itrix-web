'use client';

import { useEffect, useRef } from 'react';
import { useRailStore } from '@/store/railStore';
import { ConversationRail } from './ConversationRail';
import { RAIL_COPY } from '@/lib/content/composerCopy';

/**
 * The conversation rail as a slide-over, for tablet and mobile.
 *
 * RENAMED FROM SidebarSheet. Below 1024px the rail becomes a sheet so the
 * conversation gets the full width. What it must NOT do is change what is
 * authorized — this is presentation only, and it renders the very same
 * ConversationRail.
 *
 * ONE SHEET AT A TIME (Architecture v2.7 §25.2). Phase 2 adds the content pane as
 * a second sheet at the same breakpoints, and both may not be open together.
 * Enforcing that needs both stores, so it is Phase 2's job; this component
 * deliberately does not pre-empt it with a half-rule.
 *
 * Focus moves into the sheet on open and returns to the opener on close, and
 * Escape closes it. A slide-over that traps a keyboard user is worse than no
 * slide-over at all.
 */
export function RailSheet() {
  const open = useRailStore((s) => s.sheetOpen);
  const close = useRailStore((s) => s.closeSheet);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      returnTo.current?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="rail-sheet" role="presentation">
      <button
        type="button"
        className="rail-sheet__scrim"
        aria-label={RAIL_COPY.closeNavigation}
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={RAIL_COPY.openNavigation}
        tabIndex={-1}
        className="rail-sheet__panel"
      >
        <ConversationRail inSheet />
      </div>
    </div>
  );
}
