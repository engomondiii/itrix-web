'use client';

import { PENDING_COPY, PENDING_STAGE_LABEL, type PendingStage } from '@/lib/content/pendingCopy';

/**
 * The stage a pending turn is at.
 *
 * ── EXACTLY THREE STRINGS, AND THEY ARE NOT INVENTED HERE ───────────────────
 * They come from lib/content/pendingCopy.ts and are driven by the backend's real
 * pipeline transitions (R42). With no stage reported, the label falls back to a
 * neutral "Working on your answer" rather than guessing at the first step — a
 * surface that claims to be "retrieving approved material" when it has not started
 * is lying about something small, which is how a visitor learns to discount the
 * larger things it says.
 *
 * When the wait has run long, the label becomes the timeout line. That reports
 * elapsed time, which we know, and nothing about the backend, which we do not.
 */
export function PendingStageLabel({ stage, slow }: { stage: PendingStage | null; slow: boolean }) {
  const text = slow
    ? PENDING_COPY.timeout
    : stage
      ? PENDING_STAGE_LABEL[stage]
      : PENDING_COPY.waiting;

  return <span className="pending__label">{text}</span>;
}
