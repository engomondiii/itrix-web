'use client';

import { useEffect, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { COMPOSER_COPY } from '@/lib/content/composerCopy';
import { useComposerStore } from '@/store/composerStore';

/**
 * The prompt textarea.
 *
 * WHAT IS DELIBERATELY ABSENT: `maxLength`, a character counter, and any
 * length-based validation. The 600-character ceiling is gone (R28). The server
 * keeps a safety cap of 100,000 characters and reports it as a recoverable
 * message; the UI never pre-empts the visitor's sentence and never truncates it.
 *
 * Behaviour:
 *   · Enter submits. Shift+Enter inserts a newline. That is the ergonomic every
 *     visitor already expects from a composer.
 *   · It auto-grows to a capped height, then scrolls. A textarea that grows
 *     without limit pushes the send control off screen.
 *   · It takes focus when a chip populates it (focusRequest), with the caret at
 *     the end — never selecting the text a visitor is about to edit.
 *
 * Accessibility: an accessible name (the main question via aria-labelledby, plus
 * a visually-hidden label as a fallback), helper text and the error message
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
}

const MAX_HEIGHT_PX = 320;

export function PromptTextarea({
  value, onChange, onSubmit, id, describedBy, labelledBy,
  placeholder = COMPOSER_COPY.placeholder, invalid = false, minRows = 3,
}: PromptTextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const focusRequest = useComposerStore((s) => s.focusRequest);

  /* Auto-grow. Reset to auto first so the box can also SHRINK when text is
     deleted — height:auto then scrollHeight is the only measurement that does. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT_PX ? 'auto' : 'hidden';
  }, [value]);

  /* A chip populated the composer: take focus and put the caret at the END, so
     the visitor can keep typing rather than overwrite what was just inserted. */
  useEffect(() => {
    if (focusRequest === 0) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }, [focusRequest]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <>
      <label htmlFor={id} className="sr-only">
        {COMPOSER_COPY.textareaLabel}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={minRows}
        className="composer-textarea"
        value={value}
        placeholder={placeholder}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </>
  );
}
