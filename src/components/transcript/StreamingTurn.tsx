'use client';

import { TRANSCRIPT_COPY } from '@/lib/content/composerCopy';
import { StreamCaret } from './StreamCaret';
import { UnderReviewNotice } from './UnderReviewNotice';
import { HaltedTurnNotice } from './HaltedTurnNotice';
import { CitationChip } from './CitationChip';
import { TurnActions } from './TurnActions';
import type { Turn } from '@/types/thread.types';

/**
 * An itriX turn at any point in its life.
 *
 * It replaces the Phase 1 AssistantTurn placeholder and owns every state the
 * governance model can produce:
 *
 *   pending / streaming  provisional text plus a quiet caret
 *   under_review         the approved wording, provisional text gone
 *   halted               partial text discarded, honest notice
 *   settled              the delivered answer, with citations and actions
 *   unavailable          we could not reach itriX; nothing is invented
 *
 * A TURN IS A BLOCK, NOT A BUBBLE. Same type scale as the visitor's turn; only
 * the label and surface treatment differ. No avatars, no tails, no emoji.
 *
 * Copy actions appear only once a turn is SETTLED — offering to copy text that
 * governance may still replace would be offering to copy a draft.
 */
export interface StreamingTurnProps {
  turn: Turn;
  citations?: { label: string; href?: string | null }[];
}

export function StreamingTurn({ turn, citations = [] }: StreamingTurnProps) {
  const provisional = turn.status === 'streaming' || turn.status === 'pending';

  return (
    <article
      className="turn turn--itrix"
      data-status={turn.status}
      aria-label={TRANSCRIPT_COPY.itrixTurn}
      aria-busy={provisional || undefined}
    >
      <p className="turn__label">{TRANSCRIPT_COPY.itrixTurn}</p>

      {turn.status === 'under_review' ? (
        <UnderReviewNotice />
      ) : turn.status === 'halted' ? (
        <HaltedTurnNotice />
      ) : (
        <div className="turn__body">
          {turn.body
            ? turn.body.split('\n').map((line, i) => <p key={i}>{line || '\u00A0'}</p>)
            : null}
          {provisional ? (
            <p className="turn__preparing">
              <StreamCaret />
              <span className="sr-only">Preparing a response</span>
            </p>
          ) : null}
        </div>
      )}

      {turn.status === 'settled' && citations.length > 0 ? (
        <div className="turn__citations">
          {citations.map((c) => (
            <CitationChip key={c.label} label={c.label} href={c.href} />
          ))}
        </div>
      ) : null}

      {turn.contextNote && turn.status !== 'unavailable' ? (
        <p className="turn__note">{turn.contextNote}</p>
      ) : null}

      {turn.status === 'settled' ? <TurnActions turn={turn} /> : null}
    </article>
  );
}
