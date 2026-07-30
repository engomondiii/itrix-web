'use client';

import { COMPOSER_COPY } from '@/lib/content/composerCopy';

/**
 * THE SEND CONTROL — the itriX X.
 *
 * v6.0 REPLACES SendArrowButton (Playbook v1.7 §00 change 5, R39). There is still
 * no button labelled "Begin review"; submission is still an icon-only circular
 * control at the right edge of the prompt shell. What changed is the glyph and its
 * name: the arrow became the brand X, and the accessible name became "Ask itriX".
 *
 * ── WHY THIS IS NOT `✕` ─────────────────────────────────────────────────────
 * A symmetrical 45° cross is the universal DISMISS glyph. Putting one on a submit
 * control would be a real usability regression — a visitor would reasonably read
 * it as "clear my message". So the mark is drawn at the same lean as the itriX
 * wordmark's X and the arrival motif (±34°, taller than wide), which reads as a
 * letterform rather than a close button. That distinction is the whole reason the
 * glyph is hand-drawn here instead of borrowed from an icon set.
 *
 * An icon-only control REQUIRES an accessible name, which is why `aria-label` is
 * not optional and comes from one shared string (§7.4).
 *
 * It disables only while empty or submitting. It never disables because of length
 * — there is no character ceiling on this surface (R28) — and never because an
 * attachment failed.
 */
export interface AskItrixButtonProps {
  disabled?: boolean;
  submitting?: boolean;
}

export function AskItrixButton({ disabled = false, submitting = false }: AskItrixButtonProps) {
  return (
    <button
      type="submit"
      className="composer-send"
      aria-label={COMPOSER_COPY.sendLabel}
      disabled={disabled || submitting}
      data-submitting={submitting || undefined}
    >
      {submitting ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="composer-send__icon composer-send__icon--busy" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      ) : (
        /* The itriX X: two strokes at the wordmark's lean, not a 45° cross. */
        <svg aria-hidden="true" viewBox="0 0 24 24" className="composer-send__icon composer-send__icon--x" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
          <path d="M8.1 3.7 15.9 20.3" />
          <path d="M15.9 3.7 8.1 20.3" />
        </svg>
      )}
    </button>
  );
}
