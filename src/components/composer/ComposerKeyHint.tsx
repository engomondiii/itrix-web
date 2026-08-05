'use client';

import { COMPOSER_COPY } from '@/lib/content/composerCopy';

/**
 * The keyboard hint beneath the composer.
 *
 * IT IS TEXT, NOT A TOOLTIP (Surface 1 v6.0 §3.6). A tooltip is unreachable on
 * touch and awkward for a screen reader, and this hint is the only place the
 * `Ctrl + X` accelerator is advertised — so hiding it behind a hover would make an
 * advertised feature undiscoverable on half the devices that visit.
 *
 * ENTER COMES FIRST, deliberately. `Ctrl + X` is an accelerator, never the only
 * way to send and never the primary one, and the ordering of this sentence is
 * where that intent is visible to the visitor.
 *
 * `Shift + Enter` is a second, quieter line: it matters to someone writing a long
 * description, and not at all to someone sending one sentence.
 */
/**
 * THE KEY HINT IS HIDDEN (change request, 2026-08).
 *
 * "Enter to send · Ctrl + X to ask itriX / Shift + Enter for a new line" is
 * removed from below the composer. The component and its copy stay in place so
 * the hint can be restored by flipping this one constant — and, more
 * importantly, so `COMPOSER_COPY.keyHint` remains the single source for the
 * wording if it is ever shown again.
 *
 * NOTHING ABOUT THE KEYS CHANGES. Enter still sends, Shift + Enter still
 * inserts a newline, and Ctrl + X still submits — `useSendKeys` is untouched.
 * Only the visible caption goes away.
 */
const SHOW_KEY_HINT = false;

export function ComposerKeyHint({ id }: { id?: string }) {
  if (!SHOW_KEY_HINT) return null;

  return (
    <p id={id} className="composer-keyhint">
      <span>{COMPOSER_COPY.keyHint}</span>
      <span className="composer-keyhint__secondary">{COMPOSER_COPY.keyHintNewline}</span>
    </p>
  );
}
