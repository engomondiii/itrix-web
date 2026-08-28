'use client';

import { useId } from 'react';
import type { ChangeEvent } from 'react';
import { useAuthCopy } from '@/lib/i18n/authLocale';

/**
 * The invitation code field (door 1 of sign up).
 *
 * ── ITS FAILURE MESSAGE IS A SECURITY CONTROL ───────────────────────────────
 * Unknown, already used and expired all produce ONE message (R54). Naming which it was
 * would let anyone test codes and learn which ones exist. The message's second sentence
 * — "if it was sent a while ago it may have expired" — is there to be useful without
 * being diagnostic: it covers the most likely honest cause without confirming it.
 *
 * The hint says what a code looks like, because a person who has the email open and is
 * not sure which string to copy is the common case, and telling them is free.
 *
 * `spellCheck` and autocapitalisation are off. A code is not prose, and a phone that
 * capitalises the first character produces a failure the visitor cannot see.
 */
export function InviteCodeField({
  value, onChange, error = null, onSubmitKey,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onSubmitKey?: () => void;
}) {
  const authCopy = useAuthCopy();
  const uid = useId();
  const id = `${uid}-code`;
  const hintId = `${uid}-code-hint`;
  const errorId = `${uid}-code-error`;

  return (
    <div className="invite-field">
      <label htmlFor={id} className="invite-field__label">
        {authCopy.signUp.codeLabel}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        className="invite-field__input"
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmitKey) {
            e.preventDefault();
            onSubmitKey();
          }
        }}
      />
      <p id={hintId} className="invite-field__hint">
        {authCopy.signUp.codeHint}
      </p>
      {error ? (
        <p id={errorId} className="invite-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
