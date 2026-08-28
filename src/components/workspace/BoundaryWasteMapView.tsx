'use client';

import { useWorkspaceCopy } from '@/lib/i18n/successLocale';
import type { BoundaryWasteSection } from '@/types/workspace.types';

/**
 * The Boundary Waste Map — the Assessment's central deliverable.
 *
 * QUALITATIVE ONLY, and structurally so: the section type has no numeric field,
 * so this view cannot render a speed-up, a saving or a percentage even if
 * someone later wanted it to. That is the point. Any figure here would be a
 * performance claim made before a PoC produced evidence, which is exactly what
 * the governance rules forbid on any surface (Playbook §19.5).
 *
 * Significance and confidence are shown as words, not bars, for the same reason:
 * a bar invites the reader to infer a magnitude we have not measured.
 */
export function BoundaryWasteMapView({ sections }: { sections: readonly BoundaryWasteSection[] }) {
  const workspaceCopy = useWorkspaceCopy();
  if (sections.length === 0) return null;

  return (
    <section aria-labelledby="bwm-title" className="flex flex-col gap-4">
      <div>
        <h2 id="bwm-title" className="font-display text-web-h3 text-ink-primary">
          {workspaceCopy.assessment.boundaryMapTitle}
        </h2>
        <p className="mt-2 max-w-reading text-web-body text-ink-secondary">
          {workspaceCopy.assessment.boundaryMapIntro}
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {sections.map((s, i) => (
          <li key={s.key} className="rounded-lg border border-border-soft bg-surface p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-card-title text-ink-primary">
                <span aria-hidden="true" className="mr-2 font-mono text-micro text-ink-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.title}
              </h3>
              <p className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                <span>{workspaceCopy.assessment.significanceLabel[s.significance]}</span>
                <span aria-hidden="true" className="text-ink-muted">·</span>
                <span>{workspaceCopy.assessment.confidenceLabel[s.confidence]}</span>
              </p>
            </div>
            <p className="mt-2 max-w-reading text-web-body leading-relaxed text-ink-secondary">{s.finding}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
