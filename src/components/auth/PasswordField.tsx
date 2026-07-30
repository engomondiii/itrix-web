'use client';

import { useId, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { AUTH_COPY } from '@/lib/content/authCopy';
import { PASSWORD_MAX_LENGTH } from '@/lib/validation/password';

/**
 * THE ONE PASSWORD INPUT (R52, R53).
 *
 * Mounted by sign-up under open registration, set-password, reset-password AND the
 * account-creation page. One component means the rules exist in exactly one place —
 * `create-account/page.tsx` previously validated at 10 characters inline, which is the
 * drift this closes.
 *
 * ── FOUR PROPERTIES THAT ARE EASY TO GET WRONG ──────────────────────────────
 *
 * 1. PASTE IS NEVER BLOCKED. There is no `onPaste` handler here and there must never be
 *    one. Blocking paste breaks password managers, which are the most effective thing a
 *    person can do for their own security — so a "security" measure that blocks it makes
 *    accounts less safe while looking careful.
 *
 * 2. THE AUTOFILL TOKEN IS SPECIFIC. `current-password` on sign-in, `new-password` on
 *    creation and reset. Wrong tokens are why a manager offers the old password on a
 *    reset form, and why people then paste it in.
 *
 * 3. SHOW/HIDE USES `aria-pressed`, defaults to hidden, and is a real button. A
 *    div-with-an-eye is invisible to a keyboard.
 *
 * 4. THE CAPS-LOCK HINT is shown while the field has focus. A wrong password caused by
 *    Caps Lock is the single most common avoidable sign-in failure, and the field is
 *    masked so nobody can see it happening.
 *
 * `maxLength` is set to the ceiling but is NOT described in a hint — a maximum low
 * enough to be worth mentioning is a maximum that is too low.
 */
export interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** `new-password` for creation and reset; `current-password` for sign-in. */
  autoComplete: 'new-password' | 'current-password';
  error?: string | null;
  /** Extra description id, e.g. the rules block. */
  describedBy?: string;
  onSubmitKey?: () => void;
  autoFocus?: boolean;
}

export function PasswordField({
  label, value, onChange, autoComplete, error = null, describedBy, onSubmitKey, autoFocus,
}: PasswordFieldProps) {
  const uid = useId();
  const id = `${uid}-password`;
  const errorId = `${uid}-password-error`;
  const [visible, setVisible] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  const described = [describedBy, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  function trackCaps(e: KeyboardEvent<HTMLInputElement>) {
    /* getModifierState is the only reliable read, and it is only meaningful on a real
       key event — hence checking it here rather than on focus. */
    if (typeof e.getModifierState === 'function') setCapsOn(e.getModifierState('CapsLock'));
    if (e.key === 'Enter' && onSubmitKey) {
      e.preventDefault();
      onSubmitKey();
    }
  }

  return (
    <div className="password-field">
      <label htmlFor={id} className="password-field__label">
        {label}
      </label>

      <div className="password-field__row">
        <input
          id={id}
          /* No onPaste handler. See the note above — this is load-bearing. */
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={PASSWORD_MAX_LENGTH}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          className="password-field__input"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onKeyDown={trackCaps}
          onKeyUp={trackCaps}
          onBlur={() => setCapsOn(false)}
        />

        <button
          type="button"
          className="password-field__toggle"
          aria-pressed={visible}
          aria-label={visible ? AUTH_COPY.shared.hidePassword : AUTH_COPY.shared.showPassword}
          onClick={() => setVisible((v) => !v)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {visible ? (
              <>
                <path d="M3 3l18 18" />
                <path d="M10.6 10.7a2 2 0 0 0 2.8 2.8" />
                <path d="M6.8 6.9C4.7 8.2 3.2 10 2.5 12c1.5 3.9 5.2 6.5 9.5 6.5 1.6 0 3.1-.4 4.4-1M9.9 5.6A10 10 0 0 1 12 5.5c4.3 0 8 2.6 9.5 6.5-.4 1-1 2-1.8 2.8" />
              </>
            ) : (
              <>
                <path d="M2.5 12C4 8.1 7.7 5.5 12 5.5s8 2.6 9.5 6.5c-1.5 3.9-5.2 6.5-9.5 6.5S4 15.9 2.5 12Z" />
                <circle cx="12" cy="12" r="2.6" />
              </>
            )}
          </svg>
        </button>
      </div>

      {capsOn ? (
        <p role="status" className="password-field__caps">
          {AUTH_COPY.shared.capsLock}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="password-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
