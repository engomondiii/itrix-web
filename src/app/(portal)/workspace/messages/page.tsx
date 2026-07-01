'use client';

import { useEffect, useState } from 'react';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { MessageThread } from '@/components/portal/MessageThread';
import { AgentTeamComposer } from '@/components/portal/AgentTeamComposer';
import { EmptyState } from '@/components/portal/EmptyState';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useConversations } from '@/hooks/useConversations';
import { useChatStore } from '@/store/chatStore';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { trackEvent } from '@/lib/analytics/trackEvent';

/** Messages (§63): one interleaved thread with the team + assessment intelligence. */
export default function MessagesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { conversations, thread, loading, sending, error, send } = useConversations(activeId);
  const storeThread = useChatStore((s) => (activeId ? s.threads[activeId] : undefined));

  // Default to the first (most recent) conversation once the list loads.
  useEffect(() => {
    if (!activeId && conversations.length > 0) setActiveId(conversations[0].id);
  }, [conversations, activeId]);

  return (
    <>
      <PortalTopbar title="Messages" />
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-8">
        <Card variant="default" className="flex flex-col gap-4">
          <div>
            <p className="reading text-ink-700">{PORTAL_COPY.messages.greeting}</p>
            <p className="mt-2 text-caption text-ink-400">{PORTAL_COPY.messages.greetingConfidentiality}</p>
          </div>

          {loading && !thread ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : thread ? (
            <MessageThread
              messages={thread.messages}
              teamJoined={thread.teamJoined}
              teamMemberName={thread.teamMemberName}
              pending={sending}
              underReview={storeThread?.underReview ?? false}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <EmptyState>{PORTAL_COPY.home.empty}</EmptyState>
              <div className="flex flex-wrap gap-2">
                {PORTAL_COPY.messages.suggestedFirst.map((q) => (
                  <span key={q} className="rounded-pill border border-line bg-surface-warm px-3 py-1.5 text-secondary text-ink-500">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}

          {error ? <p className="text-secondary text-error-text">{error}</p> : null}

          <AgentTeamComposer
            disabled={sending || !activeId}
            onSend={(b) => {
              trackEvent('portal.message_sent', { conversationId: activeId });
              void send(b);
            }}
          />
        </Card>
      </div>
    </>
  );
}
