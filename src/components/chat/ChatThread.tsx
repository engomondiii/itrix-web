'use client';

import { SenderLabel } from './SenderLabel';
import { CitationChip } from './CitationChip';
import { StreamingCursor } from './StreamingCursor';
import { UnderReviewPill } from './UnderReviewPill';
import { cn } from '@/lib/cn';
import type { ChatMessage } from '@/types/chat.types';

/**
 * Renders a governed thread. Sender kinds are legible at a glance (Theme §21):
 *   client → white surface card; agent → sapphire-50 wash + sapphire left rule;
 *   team   → gold-50 wash + gold left rule. No chatbot bubbles, no avatars.
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
  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn(
            'rounded-md px-4 py-3',
            m.senderKind === 'client' && 'border border-line bg-surface',
            m.senderKind === 'agent' && 'border-l-[3px] border-sapphire-600 bg-sapphire-50',
            m.senderKind === 'team' && 'border-l-[3px] border-gold-500 bg-gold-50',
          )}
        >
          <SenderLabel kind={m.senderKind} />
          <p className="mt-1 whitespace-pre-wrap text-body text-ink-900">
            {m.body}
            {m.streaming ? <StreamingCursor /> : null}
          </p>
          {m.citations.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {m.citations.map((c) => (
                <CitationChip key={c.chunkId} citation={c} />
              ))}
            </div>
          ) : null}
        </div>
      ))}

      {pending && !underReview ? (
        <div className="rounded-md border-l-[3px] border-sapphire-600 bg-sapphire-50 px-4 py-3">
          <SenderLabel kind="agent" />
          <p className="mt-1 text-body text-ink-500">
            itriX assessment is preparing a response
            <StreamingCursor />
          </p>
        </div>
      ) : null}

      {underReview ? <UnderReviewPill /> : null}
    </div>
  );
}
