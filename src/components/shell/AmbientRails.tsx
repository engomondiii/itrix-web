'use client';

import { useState } from 'react';
import { ARRIVAL_LEFT_RAIL, ARRIVAL_RIGHT_RAIL, NDA_DRAWER } from '@/lib/content/centerCopy';

/**
 * The State 1 rails: AMBIENT STRUCTURE ONLY.
 *
 * At arrival the rails carry no functional panel. The left shows a quiet path
 * marker and the principle that progression is voluntary; the right shows
 * disclosure and control. Neither may reveal an inferred company, department,
 * persona or score — the visitor has told us nothing yet, and pretending
 * otherwise is exactly the surveillance feeling the rails must never produce.
 *
 * These are drawn directly rather than through the section registry because they
 * are structure, not backend-authorized content.
 */
export function AmbientLeftRail() {
  return (
    <div className="relationship-rail__ambient">
      <p className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">
        {ARRIVAL_LEFT_RAIL.label}
      </p>
      <div className="mt-4 flex items-start gap-3">
        <span aria-hidden="true" className="font-mono text-micro text-ink-muted">
          {ARRIVAL_LEFT_RAIL.stageNumber}
        </span>
        <span className="flex flex-col gap-1">
          <strong className="text-caption font-semibold text-ink-primary">{ARRIVAL_LEFT_RAIL.stageTitle}</strong>
          <span className="text-caption text-ink-secondary">{ARRIVAL_LEFT_RAIL.stageBody}</span>
        </span>
      </div>
      <div aria-hidden="true" className="mt-5 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-pill bg-ink-primary" />
        <span className="h-px w-6 bg-accent-line" />
        <span className="h-1.5 w-1.5 rounded-pill border border-border-medium" />
        <span className="h-px w-6 bg-accent-line" />
        <span className="h-1.5 w-1.5 rounded-pill border border-border-medium" />
      </div>
      <p className="mt-5 text-caption text-ink-secondary">{ARRIVAL_LEFT_RAIL.caption}</p>
    </div>
  );
}

export function AmbientRightRail() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relationship-rail__ambient">
      <p className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">
        {ARRIVAL_RIGHT_RAIL.label}
      </p>
      <div className="mt-4 flex items-start gap-3">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-[2px] h-4 w-4 shrink-0 text-ink-muted"
             fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 5.5 6v5.5c0 4.2 2.7 7.6 6.5 9.5 3.8-1.9 6.5-5.3 6.5-9.5V6L12 3Z" />
        </svg>
        <span className="flex flex-col gap-0.5">
          <strong className="text-caption font-semibold text-ink-primary">{ARRIVAL_RIGHT_RAIL.statusTitle}</strong>
          <span className="text-caption text-ink-secondary">{ARRIVAL_RIGHT_RAIL.statusBody}</span>
        </span>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {ARRIVAL_RIGHT_RAIL.points.map((p) => (
          <li key={p} className="text-caption text-ink-secondary">{p}</li>
        ))}
      </ul>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}
              className="button-text mt-4 text-left text-caption">
        {ARRIVAL_RIGHT_RAIL.ndaLink}
      </button>
      {open ? (
        <div className="mt-3 rounded-md border border-border-soft bg-surface p-3">
          <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">{NDA_DRAWER.tier}</p>
          <p className="mt-2 text-caption leading-relaxed text-ink-secondary">{NDA_DRAWER.body}</p>
        </div>
      ) : null}
    </div>
  );
}
