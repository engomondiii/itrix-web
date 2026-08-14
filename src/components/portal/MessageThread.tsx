'use client';

import { SenderKindBadge } from './SenderKindBadge';
import { TeamJoinedNotice } from './TeamJoinedNotice';
import { UnderReviewState } from './UnderReviewState';
import { PresenceBar } from './PresenceBar';
import { CitationChip } from '@/components/chat/CitationChip';
import { attachmentsApi } from '@/lib/api/attachmentsApi';
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
            m.senderKind === 'client' && 'border border-border-medium bg-surface',
            m.senderKind === 'agent' && 'border-l-[3px] border-ink-primary bg-soft',
            m.senderKind === 'team' && 'border-l-[3px] border-accent bg-soft',
          )}
        >
          <SenderKindBadge kind={m.senderKind} />
          <p className="mt-1 whitespace-pre-wrap text-body text-ink-primary">
            {m.body}
            {m.streaming ? <StreamingCursor /> : null}
          </p>
          {m.attachments && m.attachments.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {m.attachments.map((a) => (
                <li key={a.attachmentId}>
                  {a.downloadable ? (
                    <a
                      href={attachmentsApi.downloadUrl(a.attachmentId)}
                      className="inline-flex items-center gap-1 rounded-pill border border-border-medium bg-surface px-2.5 py-1 text-caption text-ink-primary underline-offset-2 hover:underline"
                    >
                      {a.filename}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-pill border border-border-medium bg-surface px-2.5 py-1 text-caption text-ink-secondary">
                      {a.filename}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
          {Array.isArray(m.citations) && m.citations.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {m.citations.map((c) => (
                <CitationChip key={c.chunkId} citation={c} />
              ))}
            </div>
          ) : null}
        </div>
      ))}

      {pending && !underReview ? (
        <div className="rounded-md border-l-[3px] border-ink-primary bg-soft px-4 py-3">
          <SenderKindBadge kind="agent" />
          <p className="mt-1 text-body text-ink-secondary">
            {PORTAL_COPY.messages.states.preparing}
            <StreamingCursor />
          </p>
        </div>
      ) : null}

      {underReview ? <UnderReviewState /> : null}
    </div>
  );
}
