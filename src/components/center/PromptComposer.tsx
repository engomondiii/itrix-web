'use client';

import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { CENTER_COPY } from '@/lib/content/centerCopy';
import { ConfidentialityNote } from './ConfidentialityNote';

export interface PromptComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  /** Points the textarea at the main question, which acts as its visible label. */
  labelledBy?: string;
  submitting?: boolean;
  error?: string | null;
}

/**
 * The approved prompt box — a large, calm assessment surface.
 *
 * It is NOT a floating chatbot bubble, and it must never become one (Brand
 * Manual §5.6, §9.1). It is a glass surface per §8.7: background + border + blur
 * applied together, with the -webkit- prefix and an opaque @supports fallback
 * both handled in styles/glass.css.
 *
 * Behaviour:
 *   · Enter submits, Shift+Enter inserts a newline (the ergonomics visitors
 *     already expect from a composer).
 *   · A 600-character counter, matching the approved package.
 *   · Empty or too-short input surfaces an inline, associated error message —
 *     never a silent no-op, and never a browser alert.
 *
 * Accessibility: the textarea has an accessible name (the main question via
 * aria-labelledby, plus a visually-hidden label as a belt-and-braces fallback),
 * helper text and error message associated through aria-describedby, and the
 * error is announced politely.
 */
export function PromptComposer({
  value,
  onChange,
  onSubmit,
  labelledBy,
  submitting = false,
  error = null,
}: PromptComposerProps) {
  const uid = useId();
  const textareaId = `${uid}-prompt`;
  const noteId = `${uid}-safety`;
  const statusId = `${uid}-status`;
  const [touched, setTouched] = useState(false);

  const count = value.length;
  const over = count > CENTER_COPY.maxLength;

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setTouched(true);
      onSubmit();
    }
  }

  return (
    <form
      className="prompt-box mt-8"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        onSubmit();
      }}
    >
      <label htmlFor={textareaId} className="sr-only">
        {CENTER_COPY.promptAriaLabel}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <textarea
          id={textareaId}
          className="prompt-box__textarea flex-1"
          rows={3}
          maxLength={CENTER_COPY.maxLength}
          value={value}
          placeholder={CENTER_COPY.promptPlaceholder}
          aria-labelledby={labelledBy}
          aria-describedby={`${noteId} ${statusId}`}
          aria-invalid={Boolean(error) || over}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTouched(true)}
        />

        <button
          type="submit"
          className="button-primary shrink-0 justify-center sm:w-auto"
          disabled={submitting}
        >
          <span>{submitting ? 'Starting…' : CENTER_COPY.primaryAction}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <ConfidentialityNote id={noteId} variant="short" />
        <span className="font-mono text-micro text-ink-muted" aria-hidden="true">
          {count}/{CENTER_COPY.maxLength}
        </span>
      </div>

      {/* Status is never colour alone — the message itself carries the meaning. */}
      <p id={statusId} role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-caption text-error">
        {touched && error ? error : ''}
      </p>
    </form>
  );
}
