'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArtifactBlock } from '@/components/artifacts/ArtifactBlock';
import { useContentPaneContext } from '@/context/ContentPaneContext';
import { ARTIFACT_TITLE } from '@/lib/journey/artifactTypes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { Artifact } from '@/types/artifact.types';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * A PERMANENT RECORD IN THE TRANSCRIPT THAT SOMETHING WAS DELIVERED (R35).
 *
 * ── WHY THIS COMPONENT IS MANDATORY, NOT DECORATIVE ─────────────────────────
 * Moving artifacts into the content pane creates one real risk: a thread becomes a
 * list of the visitor's questions with the platform's answers living somewhere else,
 * and the visitor's record of the relationship quietly degrades
 * (Architecture v2.7 §2.7). The reference card is what prevents that. It carries the
 * type, the plain-language title and the TIME, it stays in the transcript
 * permanently, and it cannot be collapsed away. The pane is a reading surface; the
 * transcript is the record.
 *
 * ── OPEN MEANS DIFFERENT THINGS AT DIFFERENT WIDTHS, ON PURPOSE ─────────────
 * When the pane is visible, "Open" focuses the artifact there. When it is not —
 * below 768px, collapsed by the visitor, unauthorized, or the flag off — the card
 * expands the artifact INLINE instead. An artifact must never be unreachable
 * because of a layout decision, and a reveal must never force a sheet open on a
 * narrow screen (§11.5).
 *
 * The deep link is always available as a third path, for print and for sharing.
 */
export interface ArtifactReferenceCardProps {
  artifact: Artifact;
}

function deliveredAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ArtifactReferenceCard({ artifact }: ArtifactReferenceCardProps) {
  const copy = useCommonCopy();
  const { visible, focusArtifact, setSection, sections } = useContentPaneContext();
  const [expanded, setExpanded] = useState(false);

  /* Governance decides displayability, not this component. An artifact under review
     or blocked has no card, because there is nothing to say was delivered. */
  if (artifact.governanceStatus !== 'approved') return null;

  const title = ARTIFACT_TITLE[artifact.type] ?? 'Prepared for you';

  function open() {
    trackEvent('artifact.reference_opened', { type: artifact.type, target: visible ? 'pane' : 'inline' });

    if (visible) {
      if (sections.includes('artifacts')) setSection('artifacts');
      focusArtifact(artifact.id);
      return;
    }
    setExpanded((v) => !v);
  }

  return (
    <section className="artifact-ref" data-type={artifact.type}>
      <div className="artifact-ref__row">
        <span aria-hidden="true" className="artifact-ref__glyph">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3.75h8.5L19 8.25V20a.75.75 0 0 1-.75.75H6A.75.75 0 0 1 5.25 20V4.5A.75.75 0 0 1 6 3.75Z" />
            <path d="M14 4v4.5h4.5M8.5 13h7M8.5 16.5h4.5" />
          </svg>
        </span>

        <span className="artifact-ref__text">
          <span className="artifact-ref__label">{copy.preparedForYou}</span>
          <span className="artifact-ref__title">{title}</span>
          <span className="artifact-ref__time">{deliveredAt(artifact.createdAt)}</span>
        </span>

        <span className="artifact-ref__actions">
          <button type="button" className="artifact-ref__open" onClick={open} aria-expanded={!visible ? expanded : undefined}>
            {visible ? 'Open' : expanded ? 'Hide' : 'Open here'}
          </button>
          <Link href={`/a/${artifact.id}`} className="artifact-ref__link">
            {copy.openStandalone}
          </Link>
        </span>
      </div>

      {/* The inline fallback. Same renderer the pane uses — one artifact, one
          component, so the two views cannot drift. */}
      {!visible && expanded ? (
        <div className="artifact-ref__inline">
          <ArtifactBlock artifact={artifact} defaultOpen />
        </div>
      ) : null}
    </section>
  );
}
