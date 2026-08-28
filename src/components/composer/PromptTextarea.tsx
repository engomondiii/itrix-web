'use client';

import { useComposerCopy } from '@/lib/i18n/conversationLocale';

import { useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useComposerStore } from '@/store/composerStore';
import { useSendKeys } from '@/hooks/useSendKeys';

/**
 * The prompt textarea.
 *
 * WHAT IS DELIBERATELY ABSENT: `maxLength`, a character counter, and any
 * length-based validation. The server keeps a safety cap of 100,000 characters and
 * reports it as a recoverable message; the UI never pre-empts the visitor's
 * sentence and never truncates it (R28).
 *
 * ── v6.0 CHANGES TWO THINGS ─────────────────────────────────────────────────
 *
 * KEYBINDINGS MOVED OUT, to hooks/useSendKeys.ts. `Ctrl + X` now submits, under
 * two guards that are easy to get wrong and expensive to get wrong: a live text
 * selection must fall through to the platform Cut, and `Cmd + X` must never be
 * bound. Those guards live in one tested place rather than inline here, and the
 * IME `isComposing` check went with them.
 *
 * SIZE DROPPED FROM 18px TO 16px, via `--composer-text-size`. The conversation is
 * set against the reading experience of the mainstream assistant surfaces — a 16px
 * body on a ~27px line (Architecture v2.7 §21.12).
 *
 * Behaviour otherwise unchanged:
 *   · It auto-grows to a capped height, then scrolls. A textarea that grows without
 *     limit pushes the send control off screen.
 *   · It takes focus when a prompt populates it (focusRequest), with the caret at
 *     the end — never selecting the text a visitor is about to edit.
 *
 * Accessibility: an accessible name (the main question via aria-labelledby, plus a
 * visually-hidden label as a fallback), helper text and the error message
 * associated through aria-describedby.
 */
export interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  id: string;
  describedBy: string;
  labelledBy?: string;
  placeholder?: string;
  invalid?: boolean;
  /** The docked composer starts shorter than the arrival one. */
  minRows?: number;
  /** True while a submit is in flight, so a second Enter cannot double-post. */
  busy?: boolean;
}

const MAX_HEIGHT_PX = 320;

export function PromptTextarea({
  value, onChange, onSubmit, id, describedBy, labelledBy,
  placeholder, invalid = false, minRows = 3, busy = false,
}: PromptTextareaProps) {
  const composerCopy = useComposerCopy();
  const resolvedPlaceholder = placeholder ?? composerCopy.placeholder;
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const focusRequest = useComposerStore((s) => s.focusRequest);
  const { onKeyDown } = useSendKeys({ onSubmit, disabled: busy });

  /* Auto-grow. Reset to auto first so the box can also SHRINK when text is
     deleted — height:auto then scrollHeight is the only measurement that does. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT_PX ? 'auto' : 'hidden';
  }, [value]);

  /* A prompt populated the composer: take focus and put the caret at the END, so
     the visitor can keep typing rather than overwrite what was just inserted. */
  useEffect(() => {
    if (focusRequest === 0) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }, [focusRequest]);

  return (
    <>
      <label htmlFor={id} className="sr-only">
        {composerCopy.textareaLabel}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={minRows}
        className="composer-textarea"
        value={value}
        placeholder={resolvedPlaceholder}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </>
  );
}
