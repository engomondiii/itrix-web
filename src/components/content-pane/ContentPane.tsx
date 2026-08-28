'use client';

import { useId } from 'react';
import { useContentPaneContext } from '@/context/ContentPaneContext';
import { PANE_COPY, PANE_COPY_KO } from '@/lib/content/paneCopy';
import { useLocaleStore } from '@/store/localeStore';
import { ContentPaneHeader } from './ContentPaneHeader';
import { ContentPaneTabs } from './ContentPaneTabs';
import { ContentPaneSection } from './ContentPaneSection';
import { PaneEmptyState } from './PaneEmptyState';

/**
 * THE CONTENT PANE — the third zone (Architecture v2.7 §2.7, Surface 1 v6.0 §3.11).
 *
 * What it is: a right-hand pane that renders the active thread's governed payloads —
 * artifacts, authorized documents, workspace sections, Explore and Legal.
 *
 * ── WHAT IT IS NOT, AND THIS IS THE IMPORTANT PART ──────────────────────────
 * It is NOT the right value rail that v2.6 retired. Every row that v2.6 §11.6A
 * re-homed when that rail was removed STAYS re-homed, and v2.7 §2.7 restates the
 * re-homing as a prohibition. The pane carries:
 *
 *   no next-best-action        it lives inline in the transcript
 *   no confidentiality notice  it lives beneath the composer, at every state
 *   no quick help              it lives in the conversation header (R30)
 *   no specialist card         inline
 *   no scheduling card         inline
 *   no satisfaction pulse      inline
 *
 * An implementation that moves any of those into this component is a defect, and
 * tests/e2e/pane-never-holds-11-6a.spec.ts asserts it. The reasoning is not
 * aesthetic: those six rows are how a visitor reaches a human and how they know what
 * not to send us. Putting them in a panel the visitor can collapse would make the
 * platform's safety affordances optional.
 *
 * ── RENDERED, NOT DECIDED ───────────────────────────────────────────────────
 * Sections come from the journey payload. Nothing here derives entitlement, and a
 * section the backend did not authorize has no path to the screen.
 */
export function ContentPane() {
  const paneCopy = useLocaleStore((state) => state.locale) === 'ko' ? PANE_COPY_KO : PANE_COPY;
  const { available, collapsed, sections, activeSection, isSheetBreakpoint } = useContentPaneContext();
  const uid = useId();
  const panelId = `${uid}-pane-panel`;

  /* Below 1024px the pane is a sheet, mounted by PaneSheet rather than as a column.
     Rendering both would put two copies of the same panel in the tree. */
  if (!available || isSheetBreakpoint) return null;

  return (
    <aside
      className="content-pane"
      data-collapsed={collapsed || undefined}
      aria-label={paneCopy.regionLabel}
    >
      {collapsed ? (
        /* Collapsed to its edge, and still reachable by keyboard. Authorization is
           untouched — this is presentation only. */
        <ContentPaneHeader />
      ) : (
        <>
          <ContentPaneHeader />
          <ContentPaneTabs panelId={panelId} />

          <div
            id={panelId}
            role={sections.length > 1 ? 'tabpanel' : undefined}
            aria-labelledby={sections.length > 1 && activeSection ? `pane-tab-${activeSection}` : undefined}
            className="content-pane__body"
          >
            {activeSection ? <ContentPaneSection section={activeSection} /> : <PaneEmptyState />}
          </div>
        </>
      )}
    </aside>
  );
}
