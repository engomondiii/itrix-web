'use client';

import Image from 'next/image';
import { COMPOSER_COPY } from '@/lib/content/composerCopy';

/**
 * THE SEND CONTROL — the itriX X.
 *
 * v6.0 REPLACES SendArrowButton (Playbook v1.7 §00 change 5, R39). There is still
 * no button labelled "Begin review"; submission is still an icon-only circular
 * control at the right edge of the prompt shell. What changed is the glyph and its
 * name: the arrow became the brand X, and the accessible name became "Ask itriX".
 *
 * ── THE GLYPH IS THE SUPPLIED itriX X ───────────────────────────────────────
 * The mark is the brand X asset (`/brand/itrix-x-inverse.png`) — the same
 * letterform as the wordmark's X, in its reversed (white) cut because this button
 * sits on `--ink-primary` (a dark disc) with a `--ink-inverse` foreground. It is
 * NOT a symmetrical 45° cross: a dismiss glyph on a submit control would read as
 * "clear my message", so the supplied letterform is used instead of an icon-set X.
 * The busy state still swaps to the inline spinner below, which spins and inherits
 * `currentColor`, so the asset only ever renders while idle.
 *
 * An icon-only control REQUIRES an accessible name, which is why `aria-label` is
 * not optional and comes from one shared string (§7.4). The image itself is
 * `aria-hidden` — the button's label already names the control.
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
      /* NOT disabled while submitting. A second send no longer double-posts — it
         queues behind the turn in flight (useComposer) — so refusing the press
         would block a supported action. The spinner still says work is happening. */
      disabled={disabled}
      data-submitting={submitting || undefined}
    >
      {submitting ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="composer-send__icon composer-send__icon--busy" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      ) : (
        /* The supplied itriX X letterform (reversed cut, for the dark disc). */
        <Image
          src="/brand/itrix-x-inverse.png"
          alt=""
          aria-hidden="true"
          /* Intrinsic size of the supplied vector X (350×285 ≈ 1.23:1 — the X is
             WIDER than tall, where the pre-refresh cut was taller than wide). The
             CSS class sets the display width and derives the height from this ratio. */
          width={20}
          height={17}
          priority
          className="composer-send__icon composer-send__icon--x"
        />
      )}
    </button>
  );
}
