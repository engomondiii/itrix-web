'use client';

import { SenderLabel } from './SenderLabel';
import { CitationChip } from './CitationChip';
import { StreamingCursor } from './StreamingCursor';
import { UnderReviewPill } from './UnderReviewPill';
import { cn } from '@/lib/cn';
import type { ChatMessage } from '@/types/chat.types';

/**
 * Renders a governed thread. Sender kinds are legible at a glance (Theme §21):
 *   client → white surface card; agent → soft wash + sapphire left rule;
 *   team   → soft wash + gold left rule. No chatbot bubbles, no avatars.
 *
 * v4.0.3: ``citations`` is read defensively (``?? []``) so a message from any transport
 * that lacks the field can never crash the page (this was the "Cannot read properties of
 * undefined (reading 'length')" white-screen). The "preparing a response" placeholder is
 * suppressed once tokens are actually streaming into a message.
 */
export function ChatThread({
  messages,
  pending,
  underReview,
}: {
  messages: ChatMessage[];
  pending: boolean;
  underReview: boolean;
}) {
  const list = Array.isArray(messages) ? messages : [];
  const anyStreaming = list.some((m) => m.streaming === true);

  return (
    <div className="flex flex-col gap-3">
      {list.map((m) => {
        const citations = Array.isArray(m.citations) ? m.citations : [];
        return (
          <div
            key={m.id}
            className={cn(
              'rounded-md px-4 py-3',
              m.senderKind === 'client' && 'border border-border-medium bg-surface',
              m.senderKind === 'agent' && 'border-l-[3px] border-ink-primary bg-soft',
              m.senderKind === 'team' && 'border-l-[3px] border-accent bg-soft',
            )}
          >
            <SenderLabel kind={m.senderKind} />
            <p className="mt-1 whitespace-pre-wrap text-body text-ink-primary">
              {m.body}
              {m.streaming ? <StreamingCursor /> : null}
            </p>
            {citations.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {citations.map((c) => (
                  <CitationChip key={c.chunkId} citation={c} />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      {pending && !underReview && !anyStreaming ? (
        <div className="rounded-md border-l-[3px] border-ink-primary bg-soft px-4 py-3">
          <SenderLabel kind="agent" />
          <p className="mt-1 text-body text-ink-secondary">
            itriX assessment is preparing a response
            <StreamingCursor />
          </p>
        </div>
      ) : null}

      {underReview ? <UnderReviewPill /> : null}
    </div>
  );
}
