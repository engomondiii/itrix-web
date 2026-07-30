'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useContentPane, type UseContentPaneResult } from '@/hooks/useContentPane';

/**
 * One content-pane state for the whole surface.
 *
 * ── WHY A CONTEXT AND NOT JUST THE HOOK ─────────────────────────────────────
 * Three places need the SAME answer: the pane renders itself, the conversation
 * header shows the open/hide control, and the artifact reference card in the
 * transcript decides whether "Open" focuses the pane or expands inline. If each
 * called the hook independently they would each subscribe to artifacts separately —
 * three fetches, and three chances to disagree about whether the pane is visible.
 *
 * It is mounted in app/layout.tsx, ABOVE ShellModeGate, for the same reason the
 * shell contract is: the transition from arrival to working must not remount
 * anything (Architecture v2.7 §2.6).
 */
const ContentPaneContext = createContext<UseContentPaneResult | null>(null);

export function ContentPaneProvider({ children }: { children: ReactNode }) {
  const value = useContentPane();
  return <ContentPaneContext.Provider value={value}>{children}</ContentPaneContext.Provider>;
}

export function useContentPaneContext(): UseContentPaneResult {
  const ctx = useContext(ContentPaneContext);
  if (!ctx) {
    throw new Error('useContentPaneContext must be used inside ContentPaneProvider.');
  }
  return ctx;
}
