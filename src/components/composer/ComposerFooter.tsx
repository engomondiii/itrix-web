'use client';

import { ConfidentialityNote } from '@/components/center/ConfidentialityNote';
import { COMPOSER_COPY } from '@/lib/content/composerCopy';

/**
 * What sits beneath the composer.
 *
 * The confidentiality notice is a SAFETY CONTROL, not marketing copy, and it must
 * appear wherever a visitor can describe a problem (§19.4). Because the composer
 * is now present at every state from 1 to 10, this notice is now present at every
 * state — which is the whole reason it lives here rather than on the landing.
 *
 * The keyboard hint is a hint, not information: it is hidden from assistive
 * technology because a screen-reader user already knows how a textarea behaves,
 * and it is hidden on touch devices where it is meaningless.
 */
export interface ComposerFooterProps {
  noteId: string;
  statusId: string;
  error?: string | null;
  /** `short` on the arrival screen, `full` once the conversation is under way. */
  variant?: 'short' | 'full';
}

export function ComposerFooter({ noteId, statusId, error = null, variant = 'short' }: ComposerFooterProps) {
  return (
    <div className="composer-footer">
      <ConfidentialityNote id={noteId} variant={variant} className="composer-footer__note" />

      <p aria-hidden="true" className="composer-footer__hint">
        {COMPOSER_COPY.keyboardHint}
      </p>

      {/* Status is never colour alone — the message itself carries the meaning. */}
      <p id={statusId} role="status" aria-live="polite" className="composer-footer__status">
        {error ?? ''}
      </p>
    </div>
  );
}
