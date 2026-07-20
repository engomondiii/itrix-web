'use client';

import { useEffect, useRef } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { ConversationSidebar } from './ConversationSidebar';
import { SIDEBAR_COPY } from '@/lib/content/composerCopy';

/**
 * The sidebar as a slide-over, for tablet and mobile.
 *
 * Below 1024px the sidebar becomes a sheet so the conversation gets the full
 * width. What it must NOT do is change what is authorized — this is presentation
 * only, and it renders the very same ConversationSidebar.
 *
 * Focus is moved into the sheet on open and returned to the opener on close, and
 * Escape closes it. A slide-over that traps a keyboard user is worse than no
 * slide-over at all.
 */
export function SidebarSheet() {
  const open = useSidebarStore((s) => s.sheetOpen);
  const close = useSidebarStore((s) => s.closeSheet);
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
    <div className="sidebar-sheet" role="presentation">
      <button
        type="button"
        className="sidebar-sheet__scrim"
        aria-label={SIDEBAR_COPY.closeNavigation}
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={SIDEBAR_COPY.openNavigation}
        tabIndex={-1}
        className="sidebar-sheet__panel"
      >
        <ConversationSidebar inSheet />
      </div>
    </div>
  );
}
