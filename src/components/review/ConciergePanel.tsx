'use client';

import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { MessageBubble } from './MessageBubble';
import { ConfidentialityNote } from '@/components/homepage/ConfidentialityNote';
import { CONVERSATION_LINES } from '@/lib/content/immediateResponses';
import { useReview } from '@/context/ReviewContext';
import type { ChatMessage } from '@/types/chat.types';

/**
 * The inline (never floating) review assistant surface. It shows the calm opening
 * line, mirrors what the visitor described, and hands off to the two-stage
 * questions. It honours the "no visible concierge" rule by living only here, inside
 * /review — it is not a site-wide chat bubble. The messages are drawn from the
 * review store transcript plus the standard opening/acknowledge lines (§24).
 */
export function ConciergePanel({ children }: { children?: React.ReactNode }) {
  const { prompt, immediateResponse, transcript } = useReview();

  // Compose the visible thread: opening → (visitor prompt) → acknowledge → transcript.
  const thread: ChatMessage[] = [];
  const now = new Date().toISOString();

  thread.push({
    id: 'concierge-opening',
    conversationId: 'review-local',
    senderKind: 'agent',
    agentKey: 'concierge',
    body: CONVERSATION_LINES.opening,
    citations: [],
    governanceStatus: 'auto_approved',
    createdAt: now,
  });

  if (prompt.trim()) {
    thread.push({
      id: 'visitor-prompt',
      conversationId: 'review-local',
      senderKind: 'client',
      body: prompt.trim(),
      citations: [],
      governanceStatus: 'auto_approved',
      createdAt: now,
    });
    thread.push({
      id: 'concierge-ack',
      conversationId: 'review-local',
      senderKind: 'agent',
      agentKey: 'concierge',
      body: immediateResponse?.acknowledgement
        ? `${immediateResponse.acknowledgement} ${CONVERSATION_LINES.askToContinue}`
        : `${CONVERSATION_LINES.acknowledge} ${CONVERSATION_LINES.askToContinue}`,
      citations: [],
      governanceStatus: 'auto_approved',
      createdAt: now,
    });
  }

  return (
    <Card variant="default" className="flex flex-col gap-5">
      <SectionLabel>Compute Bottleneck Review</SectionLabel>

      <div className="flex flex-col gap-3">
        {thread.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {transcript.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      {immediateResponse?.ndaSensitive ? (
        <div className="rounded-md border-l-[3px] border-warning bg-warning-soft px-4 py-3">
          <p className="text-secondary text-warning-text">{CONVERSATION_LINES.redirect}</p>
        </div>
      ) : null}

      {/* The active step (prompt entry or two-stage questions) is rendered here. */}
      <div className="border-t border-line-subtle pt-5">{children}</div>

      <ConfidentialityNote />
    </Card>
  );
}
