'use client';

import { useCallback, useMemo } from 'react';
import { useShellContext } from '@/context/ShellContext';
import { useThreadContext } from '@/context/ThreadContext';
import { useContentPaneStore } from '@/store/contentPaneStore';
import { useArtifacts } from '@/hooks/useArtifacts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { siteConfig } from '@/config/site.config';
import {
  ARTIFACT_BACKED,
  CUSTOMER_SUCCESS_SECTIONS,
  RELATIONSHIP_BACKED,
  RENDERABLE_SECTIONS,
  contentPaneSectionsFromContract,
  type ContentPaneSection,
} from '@/lib/journey/contentPaneSections';
import { isPinnedArtifact } from '@/lib/journey/artifactTypes';
import type { Artifact } from '@/types/artifact.types';

/**
 * THE CONTENT PANE, DERIVED FROM THE CONTRACT.
 *
 * ── IT IS RENDERED, NOT DECIDED (Surface 1 v6.0 §3.11, R20) ─────────────────
 * `contentPaneSections` comes from the journey payload. A section the backend did
 * not authorize is not in the list, is not in the tabs, and has no renderer path.
 * Nothing here computes entitlement from anything the visitor controls, so a
 * visitor cannot widen their own pane.
 *
 * ── WHY SECTIONS CAN BE DROPPED TWICE ───────────────────────────────────────
 * First by the backend, which authorizes them; then by PHASE_2_RENDERABLE, which is
 * what this build can actually draw. An authorized section with no renderer is
 * omitted rather than shown empty: §11.6 says a section with no authorized content
 * does not render, and from the visitor's side "authorized but blank" and
 * "not there" are the same thing — except that the blank tab wastes a click.
 *
 * ── AVAILABILITY IS NOT THE SAME AS VISIBILITY ──────────────────────────────
 * `available` means the pane exists for this subject at all — the flag is on and at
 * least one section can render. `visible` means it is actually on screen right now:
 * not collapsed, and wide enough. The artifact reference card reads `visible` to
 * decide whether "Open" focuses the pane or expands the artifact inline, which is
 * the mechanism that keeps R35 true at every width.
 */

export interface UseContentPaneResult {
  available: boolean;
  visible: boolean;
  collapsed: boolean;
  /** Sections this build can render, in the backend's order. */
  sections: ContentPaneSection[];
  activeSection: ContentPaneSection | null;
  setSection: (section: ContentPaneSection) => void;

  /** Every artifact in the thread, newest first, pinned ones excluded. */
  artifacts: Artifact[];
  activeArtifact: Artifact | null;
  focusArtifact: (artifactId: string) => void;

  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  /** True below 1024px, where the pane is a sheet rather than a column. */
  isSheetBreakpoint: boolean;
}

export function useContentPane(): UseContentPaneResult {
  const { contentPaneSections, contentPaneDefaultArtifactId } = useShellContext();
  const { activeThreadId } = useThreadContext();
  const { artifacts: all } = useArtifacts(activeThreadId);

  const isSheetBreakpoint = useMediaQuery('(max-width: 1023px)');

  const collapsedByThread = useContentPaneStore((s) => s.collapsedByThread);
  const activeSectionByThread = useContentPaneStore((s) => s.activeSectionByThread);
  const activeArtifactByThread = useContentPaneStore((s) => s.activeArtifactByThread);
  const sheetOpen = useContentPaneStore((s) => s.sheetOpen);
  const setCollapsedRaw = useContentPaneStore((s) => s.setCollapsed);
  const toggleCollapsedRaw = useContentPaneStore((s) => s.toggleCollapsed);
  const setActiveSectionRaw = useContentPaneStore((s) => s.setActiveSection);
  const setActiveArtifactRaw = useContentPaneStore((s) => s.setActiveArtifact);
  const openSheet = useContentPaneStore((s) => s.openSheet);
  const closeSheet = useContentPaneStore((s) => s.closeSheet);

  /* Pinned artifacts are the transcript's standing context, not pane contents.
     `success_overview` sits above the scrolling record so a returning customer sees
     where things stand before they scroll (Architecture v2.7 §17.3); duplicating it
     in the pane would show it twice. */
  const artifacts = useMemo(
    () =>
      all
        .filter((a) => a.governanceStatus === 'approved' && !isPinnedArtifact(a.type))
        .slice()
        .sort((a, b) => b.seq - a.seq),
    [all],
  );

  const authorized = useMemo(
    () => contentPaneSectionsFromContract(contentPaneSections),
    [contentPaneSections],
  );

  /**
   * WHICH SECTIONS SURVIVE — and the rule changed in Phase 3.
   *
   * Phase 2 filtered on "does this build have a renderer". All seventeen have one now,
   * so the filter is about what a section is BACKED BY, and the two kinds behave
   * differently for a reason:
   *
   *   ARTIFACT-BACKED (artifacts, documents, workspace_*) — filtered on CONTENT.
   *     Whether a matching artifact exists is knowable from the payload already in
   *     hand, so filtering costs nothing and avoids a tab that opens onto nothing.
   *
   *   RELATIONSHIP-BACKED (outcomes, support, deployments, and the rest) — shown when
   *     the BACKEND AUTHORIZED THEM. Their content lives behind a client-JWT fetch, so
   *     filtering on content would mean fetching all ten before drawing a single tab —
   *     ten requests on every thread open, to decide whether to show a tab.
   *
   *     The authorization IS the signal: §11.6 authorizes these per state, so a backend
   *     that sends `outcomes` is telling us this subject is at State 10. Each section
   *     renders its own honest empty sentence if the fetch comes back thin.
   *
   * The State 10 six additionally require the customer-success flag, because with it
   * off their hooks are inert by design and the tabs would be six permanent blanks.
   */
  const successOn = siteConfig.featureFlags.customerSuccess;
  const sections = useMemo(
    () =>
      authorized.filter((key) => {
        if (!RENDERABLE_SECTIONS.has(key)) return false;
        if (key === 'explore' || key === 'legal') return true;
        if (key === 'artifacts') return artifacts.length > 0;

        if (RELATIONSHIP_BACKED.has(key)) {
          if (CUSTOMER_SUCCESS_SECTIONS.has(key) && !successOn) return false;
          return true;
        }

        const types = ARTIFACT_BACKED[key];
        if (!types || types.length === 0) return false;
        return artifacts.some((a) => types.includes(a.type));
      }),
    [authorized, artifacts, successOn],
  );

  const available = siteConfig.featureFlags.contentPane && sections.length > 0;
  const collapsed = activeThreadId ? Boolean(collapsedByThread[activeThreadId]) : false;
  const visible = available && !collapsed && !isSheetBreakpoint;

  const activeSection = useMemo<ContentPaneSection | null>(() => {
    const stored = activeThreadId ? activeSectionByThread[activeThreadId] : undefined;
    if (stored && sections.includes(stored)) return stored;
    return sections[0] ?? null;
  }, [activeThreadId, activeSectionByThread, sections]);

  const activeArtifact = useMemo<Artifact | null>(() => {
    const storedId = activeThreadId ? activeArtifactByThread[activeThreadId] : undefined;
    const stored = storedId ? artifacts.find((a) => a.id === storedId) : undefined;
    if (stored) return stored;
    /* The backend's default, then the newest. Never an arbitrary index. */
    const fromContract = contentPaneDefaultArtifactId
      ? artifacts.find((a) => a.id === contentPaneDefaultArtifactId)
      : undefined;
    return fromContract ?? artifacts[0] ?? null;
  }, [activeThreadId, activeArtifactByThread, artifacts, contentPaneDefaultArtifactId]);

  const setSection = useCallback(
    (section: ContentPaneSection) => setActiveSectionRaw(activeThreadId, section),
    [setActiveSectionRaw, activeThreadId],
  );

  const focusArtifact = useCallback(
    (artifactId: string) => {
      setActiveArtifactRaw(activeThreadId, artifactId);
      /* Focusing an artifact should not fight a visitor who folded the pane away
         — but it must land somewhere. On a wide screen it un-collapses; on a narrow
         one the reference card expands inline instead, and never forces a sheet
         open (Architecture v2.7 §11.5). */
      if (!isSheetBreakpoint) setCollapsedRaw(activeThreadId, false);
    },
    [setActiveArtifactRaw, setCollapsedRaw, activeThreadId, isSheetBreakpoint],
  );

  return {
    available,
    visible,
    collapsed,
    sections,
    activeSection,
    setSection,
    artifacts,
    activeArtifact,
    focusArtifact,
    toggleCollapsed: useCallback(() => toggleCollapsedRaw(activeThreadId), [toggleCollapsedRaw, activeThreadId]),
    setCollapsed: useCallback((v: boolean) => setCollapsedRaw(activeThreadId, v), [setCollapsedRaw, activeThreadId]),
    sheetOpen,
    openSheet,
    closeSheet,
    isSheetBreakpoint,
  };
}
