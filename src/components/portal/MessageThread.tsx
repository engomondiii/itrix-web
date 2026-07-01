'use client';

import { SenderKindBadge } from './SenderKindBadge';
import { TeamJoinedNotice } from './TeamJoinedNotice';
import { UnderReviewState } from './UnderReviewState';
import { PresenceBar } from './PresenceBar';
import { CitationChip } from '@/components/chat/CitationChip';
import { StreamingCursor } from '@/components/chat/StreamingCursor';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { cn } from '@/lib/cn';
import type { ChatMessage } from '@/types/chat.types';

/**
 * The portal conversation thread. Reuses the public chat family's legible sender
 * styling (client = white; agent = sapphire wash + rule; team = gold wash + rule).
 *
 * Phase 3: renders the LIVE interleave — agent/team messages stream in over the
 * portal socket (a message with `streaming` shows the caret), presence is live via
 * PresenceBar, and the under-review state flips on message.under_review. No avatars,
 * no bubbles. Falls back to the polled thread when realtime is off.
 */
export function MessageThread({
  conversationId,
  messages,
  teamJoined,
  teamMemberName,
  pending,
  underReview,
}: {
  conversationId?: string | null;
  messages: ChatMessage[];
  teamJoined: boolean;
  teamMemberName: string | null;
  pending: boolean;
  underReview: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <PresenceBar conversationId={conversationId} />

      {teamJoined && teamMemberName ? <TeamJoinedNotice name={teamMemberName} /> : null}

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
          <SenderKindBadge kind={m.senderKind} />
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
          <SenderKindBadge kind="agent" />
          <p className="mt-1 text-body text-ink-500">
            {PORTAL_COPY.messages.states.preparing}
            <StreamingCursor />
          </p>
        </div>
      ) : null}

      {underReview ? <UnderReviewState /> : null}
    </div>
  );
}
