'use client';

import { useCallback } from 'react';
import type { ReactNode } from 'react';
import { ConversationHeader } from './ConversationHeader';
import { Transcript } from '@/components/transcript/Transcript';
import { SuggestedQuestions } from '@/components/suggestions/SuggestedQuestions';
import { Composer } from '@/components/composer/Composer';
import { useThreadContext } from '@/context/ThreadContext';
import { useTranscript } from '@/hooks/useTranscript';
import { useStreamingTurn } from '@/hooks/useStreamingTurn';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useClientPageReveal } from '@/hooks/useClientPageReveal';
import { ViewYourPageButton } from './ViewYourPageButton';
import { KeepThisWorkCard } from '@/components/center/KeepThisWorkCard';

/**
 * The conversation column — the working half of the surface.
 *
 * It owns ONE decision, and it is the decision that makes the whole surface work
 * like a conversation rather than a funnel:
 *
 *   no items  → render the empty state (the approved centre, with the composer
 *               in the middle of the hero exactly as the approved landing
 *               composes it)
 *   items     → render the conversation header, the transcript, the suggestion
 *               chips, and the SAME composer docked beneath
 *
 * Crucially, this is a re-render and not a route change. The component stays
 * mounted across the transition, which is what makes R21 true: submitting from
 * the centre appends a turn and streams a response with no route transition and
 * no transcript unmount.
 *
 * PHASE 2 wires the three subscriptions that make the thread live: streamed
 * turns, generated questions, and artifact delivery (via useTranscript). A
 * sequence GAP re-fetches rather than rendering a hole — guessing at missing
 * tokens is how an unapproved fragment reaches a screen.
 */
export interface ConversationColumnProps {
  /** The approved centre. Rendered only while the conversation is empty. */
  emptyState: ReactNode;
}

export function ConversationColumn({ emptyState }: ConversationColumnProps) {
  const { activeThreadId } = useThreadContext();
  const { items, refresh } = useTranscript(activeThreadId);

  const onGap = useCallback(() => refresh(), [refresh]);
  useStreamingTurn(activeThreadId, onGap);

  const suggestions = useSuggestions(activeThreadId);

  // When the backend reveals the personalised client page for this thread, surface a
  // "View your page" button so the visitor can open /c/<token> when they are ready.
  // This is a shell-level reaction to an explicit server reveal event and navigates
  // only on the button click — so it does not touch the transcript's no-navigation
  // invariant. The link in the reply remains the fallback if realtime is off.
  const clientPage = useClientPageReveal(activeThreadId);

  const started = Boolean(activeThreadId) && items.length > 0;

  /* Computed here now that the card lives here. Same test the transcript used. */
  const hasSettledAnswer = items.some(
    (i) => i.kind === 'turn' && i.turn.role === 'itrix' && i.turn.status === 'settled',
  );

  if (!started) {
    return <div className="conversation-column conversation-column--arrival">{emptyState}</div>;
  }

  return (
    <div className="conversation-column conversation-column--active">
      <ConversationHeader />
      <Transcript items={items} />

      <div className="conversation-column__composer">
        {/* Moved out of the transcript (see the note there): appearing inside the
            scroll container changed its height mid-read and snapped the view. Here it
            is anchored above the composer, so showing or dismissing it never moves
            the conversation. */}
        <KeepThisWorkCard threadId={activeThreadId} hasSettledAnswer={hasSettledAnswer} />

        {clientPage.ready ? <ViewYourPageButton onOpen={clientPage.open} /> : null}
        {suggestions.visible ? (
          <SuggestedQuestions chips={suggestions.chips} onChoose={suggestions.choose} />
        ) : null}
        <Composer variant="docked" />
      </div>
    </div>
  );
}
