'use client';

import { useState } from 'react';
import type { Turn } from '@/types/thread.types';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * Per-turn actions. Phase 1 ships one: copy.
 *
 * It is a real affordance rather than a placeholder row — a visitor who has just
 * described their bottleneck in detail should be able to take their own words
 * with them. Nothing here can act on the CONVERSATION (no retry, no regenerate);
 * those are backend-authorized operations and arrive with streaming in Phase 2.
 */
export interface TurnActionsProps {
  turn: Turn;
  /**
   * Supplied for visitor turns that can be rewritten. Absent means no Edit
   * control — which is how assistant turns, and a visitor turn still in flight,
   * end up with Copy alone.
   */
  onEdit?: () => void;
  /** Present only for assistant turns explicitly marked incomplete by the backend. */
  onContinue?: () => void;
  continuing?: boolean;
}

export function TurnActions({ turn, onEdit, onContinue, continuing = false }: TurnActionsProps) {
  const copy = useCommonCopy();
  const [copied, setCopied] = useState(false);

  if (!turn.body) return null;

  return (
    <div className="turn__actions">
      {onEdit ? (
        <button
          type="button"
          className="turn__action"
          aria-label={copy.editAskAgain}
          onClick={onEdit}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
          </svg>
          <span>{copy.edit}</span>
        </button>
      ) : null}

      {onContinue ? (
        <button
          type="button"
          className="turn__action turn__action--continue"
          aria-label={copy.continueResponse}
          disabled={continuing}
          onClick={onContinue}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M14 8l4 4-4 4" />
          </svg>
          <span>{continuing ? copy.continuing : copy.continue}</span>
        </button>
      ) : null}

      <button
        type="button"
        className="turn__action"
        aria-label={copy.copyMessage}
        onClick={() => {
          void navigator.clipboard
            ?.writeText(turn.body)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            })
            .catch(() => setCopied(false));
        }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h8" />
        </svg>
        <span aria-live="polite">{copied ? copy.copied : copy.copy}</span>
      </button>
    </div>
  );
}
