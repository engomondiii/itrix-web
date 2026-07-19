'use client';

import { ARRIVAL_LEFT_RAIL } from '@/lib/content/centerCopy';
import { RAIL_WIDTH_CLASS, type RailWidth } from '@/lib/journey/railSections';
import { RailSection } from './RailSection';

export interface LeftRelationshipRailProps {
  width: RailWidth;
  sections?: readonly string[];
  ambient?: boolean;
}

/**
 * The LEFT rail — relationship memory and navigation.
 *
 * It holds what was heard, the pitch slides, the pathway, documents, milestones
 * and workspace sections. It is a DUMB RENDERER: it draws whatever section keys
 * the backend authorized, in the order given, and nothing else.
 *
 * Three hard rules (Surface 1 v4.0 §3.2, Architecture v2.5 §11.6):
 *   1. It must never become a public persona label or a surveillance-looking
 *      history. No inferred company, no department, no score, no tier, no stage
 *      number — at any state, to any visitor.
 *   2. A rail with no authorized sections does not mount. There is no empty
 *      decorative dashboard.
 *   3. At State 1 it is ambient structure only: a quiet path marker and the
 *      principle that progression is voluntary.
 */
export function LeftRelationshipRail({ width, sections, ambient = false }: LeftRelationshipRailProps) {
  // Rule 3 — the ambient arrival rail.
  if (ambient) {
    return (
      <aside
        className={`relationship-rail relationship-rail--left ${RAIL_WIDTH_CLASS[width]}`}
        aria-label="Current relationship stage"
      >
        <div className="relationship-rail__ambient">
          <p className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">
            {ARRIVAL_LEFT_RAIL.label}
          </p>

          <div className="mt-4 flex items-start gap-3">
            <span aria-hidden="true" className="font-mono text-micro text-ink-muted">
              {ARRIVAL_LEFT_RAIL.stageNumber}
            </span>
            <span className="flex flex-col gap-1">
              <strong className="text-caption font-semibold text-ink-primary">
                {ARRIVAL_LEFT_RAIL.stageTitle}
              </strong>
              <span className="text-caption text-ink-secondary">{ARRIVAL_LEFT_RAIL.stageBody}</span>
            </span>
          </div>

          {/* The route-line motif: three stops, the first active. Decorative. */}
          <div aria-hidden="true" className="mt-5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-pill bg-ink-primary" />
            <span className="h-px w-6 bg-accent-line" />
            <span className="h-1.5 w-1.5 rounded-pill border border-border-medium" />
            <span className="h-px w-6 bg-accent-line" />
            <span className="h-1.5 w-1.5 rounded-pill border border-border-medium" />
          </div>

          <p className="mt-5 text-caption text-ink-secondary">{ARRIVAL_LEFT_RAIL.caption}</p>
        </div>
      </aside>
    );
  }

  // Rule 2 — nothing authorized means nothing mounts.
  const keys = sections?.filter(Boolean) ?? [];
  if (keys.length === 0) return null;

  return (
    <aside
      className={`relationship-rail relationship-rail--left ${RAIL_WIDTH_CLASS[width]}`}
      aria-label="Your relationship context"
    >
      {keys.map((key) => (
        <RailSection key={key} sectionKey={key} side="left" />
      ))}
    </aside>
  );
}
