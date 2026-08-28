'use client';

import { useEffect, useId, useRef } from 'react';
import { useContentPaneContext } from '@/context/ContentPaneContext';
import { useRailStore } from '@/store/railStore';
import { PANE_COPY, PANE_COPY_KO } from '@/lib/content/paneCopy';
import { useLocaleStore } from '@/store/localeStore';
import { ContentPaneHeader } from './ContentPaneHeader';
import { ContentPaneTabs } from './ContentPaneTabs';
import { ContentPaneSection } from './ContentPaneSection';
import { PaneEmptyState } from './PaneEmptyState';

/**
 * The content pane as an overlay, below 1024px.
 *
 * ── ONE SHEET AT A TIME (Architecture v2.7 §25.2) ───────────────────────────
 * The conversation rail is also a sheet at these widths, and both may not be open
 * together. Phase 1 could not enforce that — only one sheet existed — so it is
 * enforced here, where both stores are in scope: opening this one closes the rail.
 * Two stacked overlays over a conversation is how a visitor loses track of where
 * they are, and on a phone it leaves no visible anchor at all.
 *
 * Focus moves in on open and returns to the opener on close, and Escape closes it. A
 * full-screen overlay that traps a keyboard user is worse than no overlay.
 *
 * NOTHING HERE FORCES ITSELF OPEN. A reveal or a delivered artifact never opens this
 * sheet on a narrow breakpoint (§11.5) — the artifact reference card expands inline
 * instead, which is why R35 holds at 390px.
 */
export function PaneSheet() {
  const paneCopy = useLocaleStore((state) => state.locale) === 'ko' ? PANE_COPY_KO : PANE_COPY;
  const { available, sections, activeSection, sheetOpen, closeSheet, isSheetBreakpoint } =
    useContentPaneContext();
  const closeRail = useRailStore((s) => s.closeSheet);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const uid = useId();
  const panelId = `${uid}-sheet-panel`;

  const open = available && isSheetBreakpoint && sheetOpen;

  useEffect(() => {
    if (!open) return;
    /* One sheet at a time. */
    closeRail();
    returnTo.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSheet();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      returnTo.current?.focus?.();
    };
  }, [open, closeRail, closeSheet]);

  if (!open) return null;

  return (
    <div className="pane-sheet" role="presentation">
      <button type="button" className="pane-sheet__scrim" aria-label={paneCopy.close} onClick={closeSheet} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={paneCopy.regionLabel}
        tabIndex={-1}
        className="pane-sheet__panel"
      >
        <ContentPaneHeader onClose={closeSheet} />
        <ContentPaneTabs panelId={panelId} />
        <div id={panelId} className="pane-sheet__body">
          {activeSection ? <ContentPaneSection section={activeSection} /> : <PaneEmptyState />}
        </div>
        {sections.length === 0 ? <PaneEmptyState /> : null}
      </div>
    </div>
  );
}
