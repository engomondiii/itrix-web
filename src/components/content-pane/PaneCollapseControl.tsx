'use client';

import { useContentPaneContext } from '@/context/ContentPaneContext';
import { PANE_COPY } from '@/lib/content/paneCopy';

/**
 * Fold the pane away, and bring it back.
 *
 * COLLAPSING CHANGES NOTHING ABOUT AUTHORIZATION (Surface 1 v6.0 §3.11). The
 * section list still comes from the backend; the visitor has simply chosen to give
 * the conversation the width. The preference is remembered per thread, because
 * folding the pane in one conversation is not a statement about another.
 */
export function PaneCollapseControl() {
  const { collapsed, toggleCollapsed } = useContentPaneContext();

  return (
    <button
      type="button"
      className="pane__collapse"
      aria-label={collapsed ? PANE_COPY.expand : PANE_COPY.collapse}
      onClick={toggleCollapsed}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={collapsed ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'} />
      </svg>
    </button>
  );
}
