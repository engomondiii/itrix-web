'use client';

import { useEffect, useState } from 'react';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { InboxList } from '@/components/portal/InboxList';
import { MessageThread } from '@/components/portal/MessageThread';
import { AgentTeamComposer } from '@/components/portal/AgentTeamComposer';
import { BriefingView } from '@/components/portal/BriefingView';
import { EmptyState } from '@/components/portal/EmptyState';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useConversations } from '@/hooks/useConversations';
import { useChatStore } from '@/store/chatStore';
import { portalApi } from '@/lib/api/portalApi';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { PortalBriefing } from '@/types/portal.types';

/**
 * THE INBOX (§63) — read and reply, in one place.
 *
 * ── WHAT CHANGED (2026-08-10) ───────────────────────────────────────────────
 * This screen used to be a single card with one thread in it, and 'Briefing' was
 * a separate read-only nav item beside it. It is now an inbox in the ordinary
 * sense: the conversations on the left, the selected one open on the right, and
 * the reply box beneath it. The briefing is a PINNED ITEM in the same list
 * rather than a second destination — it is something the team sends you to read,
 * which is what an inbox is for.
 *
 * The briefing row selects into the reading pane and shows NO composer, because
 * a briefing is a document and a reply box under it would suggest you were
 * answering it. Replies belong to a conversation; selecting one brings the
 * composer back.
 *
 * Nothing here decides what may be read: `useConversations` and the briefing
 * fetch are both re-authorized by Django on every call.
 */
const BRIEFING_ID = '__briefing__';

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [briefing, setBriefing] = useState<PortalBriefing | null>(null);
  const { conversations, thread, loading, sending, error, send } = useConversations(
    activeId === BRIEFING_ID ? null : activeId,
  );
  const storeThread = useChatStore((s) => (activeId && activeId !== BRIEFING_ID ? s.threads[activeId] : undefined));

  /* The briefing is an inbox item, so it is fetched with the list rather than on
     its own screen. A failure leaves the row out — never an error card in place
     of the customer's messages. */
  useEffect(() => {
    let active = true;
    void (async () => {
      const res = await portalApi.briefing();
      if (active && res.data) setBriefing(res.data);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Default to the first (most recent) conversation once the list loads.
  useEffect(() => {
    if (!activeId && conversations.length > 0) setActiveId(conversations[0].id);
  }, [conversations, activeId]);

  const showingBriefing = activeId === BRIEFING_ID;

  return (
    <>
      <PortalTopbar title={PORTAL_COPY.messages.inbox.header} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-8 lg:flex-row lg:items-start">
        <InboxList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          briefingId={BRIEFING_ID}
          briefingAvailable={briefing !== null}
        />

        <Card variant="default" className="flex min-w-0 flex-1 flex-col gap-4">
          {showingBriefing ? (
            briefing ? (
              <BriefingView briefing={briefing} />
            ) : (
              <EmptyState>{PORTAL_COPY.messages.inbox.briefingNotReady}</EmptyState>
            )
          ) : (
            <>
              <div>
                <p className="reading text-ink-secondary">{PORTAL_COPY.messages.greeting}</p>
                <p className="mt-2 text-caption text-ink-secondary">
                  {PORTAL_COPY.messages.greetingConfidentiality}
                </p>
              </div>

              {loading && !thread ? (
                <div className="flex justify-center py-10">
                  <Spinner size="lg" />
                </div>
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
                  <EmptyState>{PORTAL_COPY.messages.inbox.empty}</EmptyState>
                  <div className="flex flex-wrap gap-2">
                    {PORTAL_COPY.messages.suggestedFirst.map((q) => (
                      <span
                        key={q}
                        className="rounded-pill border border-border-medium bg-surface px-3 py-1.5 text-secondary text-ink-secondary"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {error ? <p className="text-secondary text-error-text">{error}</p> : null}

              <AgentTeamComposer
                disabled={sending || !activeId}
                threadId={thread?.threadId ?? null}
                onSend={(b, attachmentIds) => {
                  trackEvent('portal.message_sent', {
                    conversationId: activeId,
                    attachments: attachmentIds.length,
                  });
                  void send(b, attachmentIds);
                }}
              />
            </>
          )}
        </Card>
      </div>
    </>
  );
}
