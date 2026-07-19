'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** The portal message input (§63). Enter sends; Shift+Enter newlines. */
export function AgentTeamComposer({ onSend, disabled }: { onSend: (body: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState('');

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  }
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border-medium pt-3">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={PORTAL_COPY.messages.inputPlaceholder}
          disabled={disabled}
          className="min-h-[2.75rem] w-full resize-y rounded-md border border-border-medium bg-surface px-3 py-2 text-body text-ink-primary placeholder:text-ink-secondary focus-visible:border-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:opacity-50"
        />
        <Button variant="primary" size="md" onClick={submit} disabled={disabled || !value.trim()}>
          {PORTAL_COPY.messages.sendButton}
        </Button>
      </div>
      <p className="text-caption text-ink-secondary">{PORTAL_COPY.messages.inputNote}</p>
    </div>
  );
}
