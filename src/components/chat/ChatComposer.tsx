'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { CONFIDENTIALITY_NOTICE } from '@/lib/content/ctaCopy';

/**
 * The message input. Non-confidential reminder sits under the box everywhere a
 * visitor can describe a problem (Playbook §63). Enter sends; Shift+Enter newlines.
 */
export function ChatComposer({
  onSend,
  disabled,
  placeholder = 'Write a message to the itriX team…',
}: {
  onSend: (body: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
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
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[2.75rem] w-full resize-y rounded-md border border-line bg-surface px-3 py-2 text-body text-ink-900 placeholder:text-ink-400 focus-visible:border-sapphire-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:opacity-50"
        />
        <Button variant="primary" size="md" onClick={submit} disabled={disabled || !value.trim()}>
          Send
        </Button>
      </div>
      <p className="text-caption text-ink-400">{CONFIDENTIALITY_NOTICE}</p>
    </div>
  );
}
