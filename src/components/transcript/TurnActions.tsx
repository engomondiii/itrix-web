'use client';

import { useState } from 'react';
import type { Turn } from '@/types/thread.types';

/**
 * Per-turn actions. Phase 1 ships one: copy.
 *
 * It is a real affordance rather than a placeholder row — a visitor who has just
 * described their bottleneck in detail should be able to take their own words
 * with them. Nothing here can act on the CONVERSATION (no retry, no regenerate);
 * those are backend-authorized operations and arrive with streaming in Phase 2.
 */
export function TurnActions({ turn }: { turn: Turn }) {
  const [copied, setCopied] = useState(false);

  if (!turn.body) return null;

  return (
    <div className="turn__actions">
      <button
        type="button"
        className="turn__action"
        aria-label="Copy this message"
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
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
