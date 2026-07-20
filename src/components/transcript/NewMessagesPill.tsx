'use client';

import { TRANSCRIPT_COPY } from '@/lib/content/composerCopy';

/**
 * Shown when a new turn arrived while the visitor was scrolled up.
 *
 * It is an INVITATION, not an interruption: the transcript does not jump, and
 * the visitor decides when to follow it. That is the whole reason auto-scroll is
 * conditional in ScrollAnchor.
 */
export function NewMessagesPill({ onJump }: { onJump: () => void }) {
  return (
    <button type="button" className="transcript__pill" onClick={onJump}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M6 13l6 6 6-6" />
      </svg>
      {TRANSCRIPT_COPY.newMessages}
    </button>
  );
}
