'use client';

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

  function handleSend(body: string) {
    if (context === 'client_page' && token) {
      trackPitchQuestionAsked({ token });
    }
    void send(body);
  }

  return (
    <Card variant="default" className="flex flex-col gap-4">
      <div>
        <SectionLabel>{title}</SectionLabel>
        {intro ? <p className="reading mt-2 text-ink-secondary">{intro}</p> : null}
      </div>

      {messages.length === 0 && suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSend(s)}
              className="rounded-pill border border-border-medium bg-surface px-3 py-1.5 text-secondary text-ink-secondary transition-colors hover:border-accent-soft hover:text-ink-primary"
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
