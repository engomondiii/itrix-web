'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { LocalizedText } from '@/components/i18n/LocalizedText';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * The message input. Non-confidential reminder sits under the box everywhere a
 * visitor can describe a problem (Playbook §63). Enter sends; Shift+Enter newlines.
 */
export function ChatComposer({
  onSend,
  disabled,
  placeholder,
}: {
  onSend: (body: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState('');
  const copy = useCommonCopy();

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
          placeholder={placeholder ?? copy.writeTeamPlaceholder}
          disabled={disabled}
          className="min-h-[2.75rem] w-full resize-y rounded-md border border-border-medium bg-surface px-3 py-2 text-body text-ink-primary placeholder:text-ink-secondary focus-visible:border-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:opacity-50"
        />
        <Button variant="primary" size="md" onClick={submit} disabled={disabled || !value.trim()}>
          {copy.send}
        </Button>
      </div>
      <p className="text-caption text-ink-secondary"><LocalizedText en="Please do not share confidential technical information until appropriate protection and authorization are in place." ko="적절한 보호와 승인이 마련되기 전에는 기밀 기술 정보를 공유하지 마세요." /></p>
    </div>
  );
}
