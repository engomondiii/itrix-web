'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ChatThread } from './ChatThread';
import { ChatComposer } from './ChatComposer';
import { useAgentChat } from '@/hooks/useAgentChat';
import type { ChatContext } from '@/types/chat.types';

/** Embedded governed chat. Client-page credentials remain httpOnly and never enter JS. */
export function AgentChatPanel({
  context, conversationId, sessionId, title = 'Ask a question', intro, suggestions = [], placeholder,
}: {
  context: ChatContext; conversationId: string; sessionId?: string; title?: string; intro?: string;
  suggestions?: string[]; placeholder?: string;
}) {
  const { messages, pending, underReview, error, send } = useAgentChat({ context, conversationId, sessionId });
  const [asked, setAsked] = useState<string[]>([]);
  const remaining = suggestions.filter((s) => !asked.includes(s));
  function handleSend(body: string) { void send(body); }
  function handleSuggestion(s: string) { setAsked((prev) => prev.includes(s) ? prev : [...prev, s]); handleSend(s); }
  return (
    <Card variant="default" className="flex flex-col gap-4">
      <div><SectionLabel>{title}</SectionLabel>{intro ? <p className="reading mt-2 text-ink-secondary">{intro}</p> : null}</div>
      {remaining.length > 0 ? <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested questions">
        {remaining.map((s) => <button key={s} type="button" onClick={() => handleSuggestion(s)} disabled={pending} className="rounded-pill border border-border-medium bg-surface px-3 py-1.5 text-secondary text-ink-secondary transition-colors hover:border-accent-soft hover:text-ink-primary disabled:cursor-not-allowed disabled:opacity-50">{s}</button>)}
      </div> : null}
      <ChatThread messages={messages} pending={pending} underReview={underReview} />
      {error ? <p className="text-secondary text-error-text">{error}</p> : null}
      <ChatComposer onSend={handleSend} disabled={pending} placeholder={placeholder ?? 'Ask about your review or the next step…'} />
    </Card>
  );
}
