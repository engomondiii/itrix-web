'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ChatThread } from './ChatThread';
import { ChatComposer } from './ChatComposer';
import { useAgentChat } from '@/hooks/useAgentChat';
import { trackPitchQuestionAsked } from '@/lib/analytics/trackPitchEvent';
import type { ChatContext } from '@/types/chat.types';

/**
 * Embedded, governed chat (client page + portal share this). Not a floating bubble —
 * it mounts inside the surface it belongs to. Phase 3: replies stream live over the
 * socket (message.delta/final) with citations and the under-review transition handled
 * by useAgentChat + ChatThread; when realtime is off it falls back to request/response.
 * On the client page, a sent question also emits pitch.question_asked analytics.
 */
/**
 * ── SUGGESTED OPTIONS PERSIST (fix, 2026-08-12) ──────────────────────────────
 * The pills used to render only while `messages.length === 0`. Clicking one created a
 * message, so by construction EVERY option disappeared the instant the visitor used the
 * first one — and the remaining paths ("Which ALPHA product fits us best?", "What can we
 * discuss before an NDA?") became unreachable unless they knew to type them out.
 *
 * They now stay for the life of the panel, minus the ones already asked. Removing a used
 * pill is the honest half: leaving it would invite the visitor to ask the same question
 * twice and read the same answer.
 */
export function AgentChatPanel({
  context,
  conversationId,
  token,
  sessionId,
  title = 'Ask a question',
  intro,
  suggestions = [],
}: {
  context: ChatContext;
  conversationId: string;
  token?: string;
  sessionId?: string;
  title?: string;
  intro?: string;
  suggestions?: string[];
}) {
  const { messages, pending, underReview, error, send } = useAgentChat({
    context,
    conversationId,
    token,
    sessionId,
  });

  /* Which suggestions have been used. Local to the panel and deliberately not
     persisted: it is a courtesy within one visit, not a record of what somebody asked. */
  const [asked, setAsked] = useState<string[]>([]);
  const remaining = suggestions.filter((s) => !asked.includes(s));

  function handleSend(body: string) {
    if (context === 'client_page' && token) {
      trackPitchQuestionAsked({ token });
    }
    void send(body);
  }

  function handleSuggestion(suggestion: string) {
    setAsked((prev) => (prev.includes(suggestion) ? prev : [...prev, suggestion]));
    handleSend(suggestion);
  }

  return (
    <Card variant="default" className="flex flex-col gap-4">
      <div>
        <SectionLabel>{title}</SectionLabel>
        {intro ? <p className="reading mt-2 text-ink-secondary">{intro}</p> : null}
      </div>

      {remaining.length > 0 ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested questions">
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              /* Disabled only while a reply is in flight — the same guard the composer
                 uses, so a second question cannot be sent on top of an unfinished one. */
              disabled={pending}
              className="rounded-pill border border-border-medium bg-surface px-3 py-1.5 text-secondary text-ink-secondary transition-colors hover:border-accent-soft hover:text-ink-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <ChatThread messages={messages} pending={pending} underReview={underReview} />

      {error ? <p className="text-secondary text-error-text">{error}</p> : null}

      <ChatComposer onSend={handleSend} disabled={pending} placeholder="Ask about your review, the products, or the next steps…" />
    </Card>
  );
}
