'use client';

import type { ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { PANE_SECTION_INTRO, PANE_SECTION_LABEL } from '@/lib/content/paneCopy';
import { PaneEmptyState } from '../PaneEmptyState';
import type { ContentPaneSection } from '@/lib/journey/contentPaneSections';

/**
 * The frame every pane section shares: heading, optional standfirst, and one of
 * loading / empty / content.
 *
 * ── WHY A SHARED FRAME AND NOT THIRTEEN COPIES ──────────────────────────────
 * Thirteen sections, each with its own loading and empty branch, is thirteen chances
 * for one of them to render a skeleton for data that is never coming, or to show
 * nothing at all where it should say why. The interesting part of each section is
 * WHICH SHIPPED COMPONENT it mounts; the wrapper is not interesting and should not be
 * re-decided per section.
 *
 * The heading is an `h3` because the pane's own header is the `h2` and the arrival
 * question is the platform's only `h1` (Surface 1 v6.0 §7.4).
 */
export interface PaneSectionFrameProps {
  section: ContentPaneSection;
  loading?: boolean;
  /** True when the fetch succeeded but there is nothing to show. */
  empty?: boolean;
  /** Overrides the default empty sentence where a section has a better one. */
  emptyMessage?: string;
  children?: ReactNode;
}

export function PaneSectionFrame({
  section, loading = false, empty = false, emptyMessage, children,
}: PaneSectionFrameProps) {
  return (
    <div className="pane__section" data-section={section}>
      <h3 className="pane__section-title">{PANE_SECTION_LABEL[section]}</h3>
      {PANE_SECTION_INTRO[section] ? (
        <p className="pane__section-intro">{PANE_SECTION_INTRO[section]}</p>
      ) : null}

      {loading ? (
        <div className="pane__loading"><Spinner size="sm" /></div>
      ) : empty ? (
        <PaneEmptyState message={emptyMessage} />
      ) : (
        children
      )}
    </div>
  );
}
