'use client';

import { useContentPaneContext } from '@/context/ContentPaneContext';
import { useJourneyContext } from '@/context/JourneyContext';
import { ARTIFACT_TITLE } from '@/lib/journey/artifactTypes';
import { CENTER_COPY } from '@/lib/content/centerCopy';
import { stateLabelFor } from '@/lib/content/composerCopy';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';
import { PaneSectionFrame } from './_shared';

/**
 * YOUR PATHWAY — where things stand, and what has been delivered.
 *
 * ── THIS SECTION IS NOT IN THE SPECIFICATION'S PHASE 3 LIST ─────────────────
 * Surface 1 v6.0 §05 names eleven sections; `pathway` and `nda` are not among them,
 * yet §11.6 authorizes both (States 4–5 and State 6). Leaving them unrendered would
 * mean two of seventeen vocabulary keys are permanently dead — a visitor at State 6
 * would be authorized for a section that never appears. So both are implemented, and
 * the deviation is recorded in the README.
 *
 * ── WHAT IT RENDERS, AND WHAT IT REFUSES TO INVENT ──────────────────────────
 * Only two things this build actually knows: the four-step pathway in its APPROVED
 * wording, with the visitor's current position marked; and the artifacts that have
 * been delivered, by title and time.
 *
 * It does NOT render a next step. A next step is a next-best-action, which §11.6A
 * re-homed into the conversation and §2.7 forbids here. This section says where you
 * are; the conversation says what happens next.
 */
export function PathwayPaneSection() {
  const { state, journeyNumber } = useJourneyContext();
  const { artifacts } = useContentPaneContext();

  /* The pathway hint has four steps and the journey has ten states, so the mapping is
     deliberately coarse: it marks the FURTHEST step reached rather than pretending to a
     precision the four-step copy does not have. */
  const reached = journeyNumber && journeyNumber >= 5 ? 3 : journeyNumber && journeyNumber >= 4 ? 2 : journeyNumber && journeyNumber >= 3 ? 1 : 0;

  return (
    <PaneSectionFrame section="pathway">
      <div className="pane__stack">
        <ol className="pane__pathway">
          {CENTER_COPY.pathwayHint.map((step, i) => (
            <li key={step} data-reached={i <= reached || undefined} data-current={i === reached || undefined}>
              <span className="pane__pathway-step">{step}</span>
            </li>
          ))}
        </ol>

        <p className="pane__note">
          Where things stand: <strong>{stateLabelFor(journeyNumber)}</strong>
          {state ? '' : ''}
        </p>

        {artifacts.length > 0 ? (
          <ul className="pane__delivered">
            {artifacts.map((a) => (
              <li key={a.id}>
                <span className="pane__delivered-title">{ARTIFACT_TITLE[a.type] ?? 'Prepared for you'}</span>
                <span className="pane__delivered-time">{new Date(a.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="pane__note">{PANE_SECTION_EMPTY.pathway}</p>
        )}
      </div>
    </PaneSectionFrame>
  );
}
