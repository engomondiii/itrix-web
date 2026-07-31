'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PENDING_COPY } from '@/lib/content/pendingCopy';
import { PendingStageLabel } from './PendingStageLabel';
import { ItrixTurnLabel } from './ItrixTurnLabel';
import type { PendingStage } from '@/lib/content/pendingCopy';

/**
 * WHAT THE VISITOR SEES WHILE ITRIX WORKS (Surface 1 v6.0 §3.10, R42).
 *
 * ── THE GLYPH ───────────────────────────────────────────────────────────────
 * A 3×3 lattice of small squares. One filled cell hands off to an ADJACENT cell
 * about every 900ms, and the filled count is CONSERVED — what leaves one cell
 * enters another. It is a visual restatement of the antisymmetric transfer FQNM
 * executes, and it is the one place this surface is allowed to be quietly clever
 * about the mathematics underneath it.
 *
 * The walk is a FIXED path between neighbours rather than a random one, because a
 * random walk occasionally revisits a cell and appears to stand still — and an
 * indicator that looks stopped is indistinguishable from one that has failed.
 *
 *   0 1 2      the walk: 0 → 1 → 2 → 5 → 8 → 7 → 6 → 3 → 4 → 5 → 4 → 1 → 0 …
 *   3 4 5      every step moves to a cell that shares an edge with the last.
 *   6 7 8
 *
 * ── WHAT IS FORBIDDEN, AND WHY EACH ─────────────────────────────────────────
 * No bouncing dots, spinner or shimmer sweep — chat-app furniture the Brand Manual
 * already bans. No progress bar or percentage: that would claim knowledge of a
 * duration nobody has. No "itriX is typing", no avatar, no emoji, no animated
 * ellipsis: nobody is typing, and implying a person is at a keyboard is a small lie
 * that the rest of the surface then has to live beside.
 *
 * ── ACCESSIBILITY ───────────────────────────────────────────────────────────
 * ONE polite announcement when the wait begins. Stage changes are NOT announced —
 * narrating three transitions per turn would make the transcript unusable with a
 * screen reader. Under `prefers-reduced-motion` the lattice is STATIC and the label
 * carries the whole message; the timer is not merely hidden, it never starts.
 */

/** A closed walk over the lattice. Consecutive entries share an edge. */
const WALK = [0, 1, 2, 5, 8, 7, 6, 3, 4, 5, 4, 1] as const;
const STEP_MS = 900;

export interface PendingTransferIndicatorProps {
  stage: PendingStage | null;
  slow: boolean;
  onRetry?: () => void;
}

export function PendingTransferIndicator({ stage, slow, onRetry }: PendingTransferIndicatorProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [step, setStep] = useState(0);

  useEffect(() => {
    /* Not started, not just hidden. A timer running behind a static glyph is work
       nobody asked for on a device that asked for less. */
    if (reducedMotion) return;
    const timer = setInterval(() => setStep((s) => (s + 1) % WALK.length), STEP_MS);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  const filled = reducedMotion ? 4 : WALK[step];

  return (
    <article className="turn turn--itrix pending" aria-busy="true">
      <p className="turn__label turn__label--brand">
        <ItrixTurnLabel />
      </p>

      <div className="pending__row">
        {/* aria-hidden: the label carries the meaning. A lattice of squares has
            nothing useful to say to a screen reader. */}
        <span className="pending__lattice" aria-hidden="true" data-static={reducedMotion || undefined}>
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="pending__cell" data-filled={i === filled || undefined} />
          ))}
        </span>

        <PendingStageLabel stage={stage} slow={slow} />

        {slow && onRetry ? (
          <button type="button" className="pending__retry" onClick={onRetry}>
            {PENDING_COPY.retry}
          </button>
        ) : null}
      </div>

      {/* Announced once, politely, at the start of the wait. The region mounts with
          the text already in it, so it is read once and not on every re-render. */}
      <p role="status" aria-live="polite" className="sr-only">
        {PENDING_COPY.announcement}
      </p>
    </article>
  );
}
