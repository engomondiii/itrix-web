'use client';

import { ConfidentialityNote } from '@/components/center/ConfidentialityNote';
import { ComposerKeyHint } from './ComposerKeyHint';

/**
 * What sits beneath the composer.
 *
 * The confidentiality notice is a SAFETY CONTROL, not marketing copy, and it must
 * appear wherever a visitor can describe a problem (§19.4). Because the composer
 * is present at every state from 1 to 10, this notice is present at every state —
 * which is the whole reason it lives here rather than on the landing.
 *
 * ── v6.0 FIX: THE FULL NOTICE NOW RENDERS AT EVERY STATE ────────────────────
 * It used to render the SHORT line on the arrival screen and the full one only once
 * the conversation was docked. That was a real gap against R10 and Architecture
 * v2.7 §19.4, which require the exact approved wording "wherever a visitor can
 * describe a problem" — and the arrival screen is the first place they can.
 *
 * The short line said less than the full one and nothing the full one does not say,
 * so the fix is to stop switching: the full notice renders everywhere, and
 * CENTER_COPY.safetyNote is retained for reference rather than displayed. The
 * `variant` prop stays in the signature because callers pass it and because Phase 2
 * may want a compact treatment inside the content pane — it no longer changes which
 * approved string is shown.
 *
 * ── AND THE KEYBOARD HINT IS NO LONGER HIDDEN ───────────────────────────────
 * It used to be `aria-hidden`, on the reasoning that a screen-reader user already
 * knows how a textarea behaves. That reasoning stopped holding the moment the hint
 * began advertising a NON-STANDARD accelerator: `Ctrl + X` is not something a
 * textarea does by default, so hiding the sentence that mentions it would hide the
 * feature from exactly the users most likely to want a keyboard path
 * (Surface 1 v6.0 §3.6, §7.4).
 */
export interface ComposerFooterProps {
  noteId: string;
  statusId: string;
  error?: string | null;
  /**
   * Retained for callers and for a possible compact treatment in the content pane.
   * IT NO LONGER SELECTS THE APPROVED STRING — see the note above.
   */
  variant?: 'short' | 'full';
}

export function ComposerFooter({ noteId, statusId, error = null }: ComposerFooterProps) {
  return (
    <div className="composer-footer">
      <ConfidentialityNote id={noteId} variant="full" className="composer-footer__note" />

      <ComposerKeyHint />

      {/* Status is never colour alone — the message itself carries the meaning. */}
      <p id={statusId} role="status" aria-live="polite" className="composer-footer__status">
        {error ?? ''}
      </p>
    </div>
  );
}
