'use client';

import { COMPOSER_COPY } from '@/lib/content/composerCopy';

/**
 * The send control.
 *
 * THERE IS NO BUTTON LABELLED "BEGIN REVIEW" (Surface 1 v5.0 §00.1 change 5).
 * Submission is an icon-only arrow, exactly as the approved prototype composes
 * it: a circular control at the right edge of the prompt shell.
 *
 * An icon-only control therefore REQUIRES an accessible name, which is why
 * `aria-label` is not optional here and comes from one shared string (§7.4).
 *
 * It disables only while empty or submitting. It never disables because of
 * length — there is no character ceiling on this surface (R28).
 */
export interface SendArrowButtonProps {
  disabled?: boolean;
  submitting?: boolean;
}

export function SendArrowButton({ disabled = false, submitting = false }: SendArrowButtonProps) {
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
        <svg aria-hidden="true" viewBox="0 0 24 24" className="composer-send__icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}
