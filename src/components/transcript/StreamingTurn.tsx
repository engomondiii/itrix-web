'use client';

import { useTranscriptCopy } from '@/lib/i18n/conversationLocale';

import { StreamCaret } from './StreamCaret';
import { ItrixTurnLabel } from './ItrixTurnLabel';
import { UnderReviewNotice } from './UnderReviewNotice';
import { HaltedTurnNotice } from './HaltedTurnNotice';
import { CitationChip } from './CitationChip';
import { MarkdownTurn } from './MarkdownTurn';
import { TurnActions } from './TurnActions';
import { useContinueGeneration } from '@/hooks/useContinueGeneration';
import type { Turn } from '@/types/thread.types';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

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
 *
 * ── v6.0 PHASE 2: THE BODY RENDERS AS MARKDOWN ──────────────────────────────
 * It used to split on newlines and emit paragraphs, so a turn containing a list, a
 * table or a code block arrived as asterisks and pipes. `MarkdownTurn` renders them —
 * from a closed feature set, with no HTML string anywhere in the path, and throttled
 * while the turn is still provisional so text arrives rather than flickers
 * (Architecture v2.7 §19.9).
 *
 * The GOVERNANCE STATES ARE UNTOUCHED by that change, and must stay untouched:
 * `under_review` and `halted` still render their notices instead of the body, so
 * rendering Markdown cannot put provisional text on screen that governance has
 * replaced or discarded. Formatting changes presentation only.
 */
export interface StreamingTurnProps {
  turn: Turn;
  citations?: { label: string; href?: string | null }[];
}

export function StreamingTurn({ turn, citations = [] }: StreamingTurnProps) {
  const transcriptCopy = useTranscriptCopy();
  const commonCopy = useCommonCopy();
  const provisional = turn.status === 'streaming' || turn.status === 'pending';
  const { continueGeneration, continuing } = useContinueGeneration(turn);

  return (
    <article
      className="turn turn--itrix"
      data-status={turn.status}
      aria-label={transcriptCopy.itrixTurn}
      aria-busy={provisional || undefined}
    >
      <p className="turn__label turn__label--brand">
        <ItrixTurnLabel />
      </p>

      {turn.status === 'under_review' ? (
        <UnderReviewNotice />
      ) : turn.status === 'halted' ? (
        <HaltedTurnNotice />
      ) : (
        <div className="turn__body">
          {turn.body ? <MarkdownTurn body={turn.body} provisional={provisional} /> : null}
          {provisional ? (
            <p className="turn__preparing">
              <StreamCaret />
              <span className="sr-only">{commonCopy.preparingResponse}</span>
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

      {turn.status === 'settled' ? (
        <TurnActions
          turn={turn}
          onContinue={turn.canContinue ? () => void continueGeneration() : undefined}
          continuing={continuing}
        />
      ) : null}
    </article>
  );
}
