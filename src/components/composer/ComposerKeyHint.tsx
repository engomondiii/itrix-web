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
export function ComposerKeyHint({ id }: { id?: string }) {
  return (
    <p id={id} className="composer-keyhint">
      <span>{COMPOSER_COPY.keyHint}</span>
      <span className="composer-keyhint__secondary">{COMPOSER_COPY.keyHintNewline}</span>
    </p>
  );
}
