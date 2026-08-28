'use client';

import { PENDING_COPY, PENDING_COPY_KO, PENDING_STAGE_LABEL, PENDING_STAGE_LABEL_KO, type PendingStage } from '@/lib/content/pendingCopy';
import { useLocaleStore } from '@/store/localeStore';

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
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const copy = ko ? PENDING_COPY_KO : PENDING_COPY;
  const labels = ko ? PENDING_STAGE_LABEL_KO : PENDING_STAGE_LABEL;
  const text = slow
    ? copy.timeout
    : stage
      ? labels[stage]
      : copy.waiting;

  return <span className="pending__label">{text}</span>;
}
