'use client';

import type { ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { PANE_SECTION_INTRO, PANE_SECTION_INTRO_KO, PANE_SECTION_LABEL, PANE_SECTION_LABEL_KO, PANE_SECTION_EMPTY_KO } from '@/lib/content/paneCopy';
import { useLocaleStore } from '@/store/localeStore';
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
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const label = ko ? PANE_SECTION_LABEL_KO[section] : PANE_SECTION_LABEL[section];
  const intro = ko ? PANE_SECTION_INTRO_KO[section] : PANE_SECTION_INTRO[section];
  const localizedEmpty = ko && !emptyMessage ? PANE_SECTION_EMPTY_KO[section] : emptyMessage;
  return (
    <div className="pane__section" data-section={section}>
      <h3 className="pane__section-title">{label}</h3>
      {intro ? <p className="pane__section-intro">{intro}</p> : null}

      {loading ? (
        <div className="pane__loading"><Spinner size="sm" /></div>
      ) : empty ? (
        <PaneEmptyState message={localizedEmpty} />
      ) : (
        children
      )}
    </div>
  );
}
