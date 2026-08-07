'use client';

import { useCallback } from 'react';
import { Transcript } from '@/components/transcript/Transcript';
import { Composer } from '@/components/composer/Composer';
import { useThreadContext } from '@/context/ThreadContext';
import { useTranscript } from '@/hooks/useTranscript';
import { useStreamingTurn } from '@/hooks/useStreamingTurn';

/**
 * THE CONVERSATION, ON THE PERSONALISED PAGE.
 *
 * ── WHAT WAS WRONG ──────────────────────────────────────────────────────────
 * `/c/<token>` rendered a bare `<Composer variant="docked" />` and nothing else.
 * The composer submits through `useComposer`, which posts to the visitor's review
 * thread — so a message sent from the personalised page WAS delivered and WAS
 * answered, and the visitor never saw either. There was no transcript on the page
 * to render them into.
 *
 * From their side: type, press send, the box clears, nothing happens. Forever.
 *
 * ── WHY THIS REUSES THE REVIEW COMPONENTS RATHER THAN NEW ONES ──────────────
 * The asked-for behaviour is "the same as the initial chat component" — the X send
 * control, Markdown rendering, the pending message. All three already exist and are
 * already correct in `Transcript` → `StreamingTurn` → `MarkdownTurn`, and the
 * pending indicator lives inside `Transcript`. Reimplementing any of it here would
 * be a second copy to keep in step, and the one guaranteed outcome of two copies is
 * that they diverge.
 *
 * `useStreamingTurn` is what subscribes this surface to `message.delta` /
 * `message.final`, so replies stream here exactly as they do on the review page.
 * It shares one WebSocket with every other hook on the page (see
 * lib/realtime/sharedSocket).
 *
 * ── AND IT ANSWERS "WHAT AM I SCROLLING?" ───────────────────────────────────
 * The page had one scroll region containing both the review content and a composer
 * pinned under it, so a drag could move either and the reader could not tell which.
 * The conversation is now its own labelled region with its own scrollbar, and the
 * page content keeps its own. Two panels, two scrollbars, no ambiguity.
 */
export function ClientPageConversation() {
  const { activeThreadId } = useThreadContext();
  const { items, refresh } = useTranscript(activeThreadId);

  const onGap = useCallback(() => refresh(), [refresh]);
  useStreamingTurn(activeThreadId, onGap);

  const hasConversation = Boolean(activeThreadId) && items.length > 0;

  return (
    <section className="client-conversation" aria-label="Your conversation about this review">
      {hasConversation ? (
        <div className="client-conversation__log">
          <Transcript items={items} />
        </div>
      ) : (
        <p className="client-conversation__empty">
          Ask anything about this review and it will be answered here.
        </p>
      )}

      <div className="client-conversation__composer">
        <Composer variant="docked" />
      </div>
    </section>
  );
}
