'use client';

import { useEffect, useRef } from 'react';
import { AUTH_COPY } from '@/lib/content/authCopy';

/**
 * One error summary, above the fields, focused on submit failure.
 *
 * ── WHY A SUMMARY AND NOT ONLY PER-FIELD MESSAGES ───────────────────────────
 * A per-field message under an input is invisible to someone who has just pressed a
 * button at the bottom of a form and whose focus is still on that button. The summary
 * is announced and takes focus, which is the difference between "nothing happened" and
 * "here is what to fix" for a screen-reader user.
 *
 * It is a `role="alert"` region, and it moves focus exactly once per failure — a
 * summary that re-grabs focus on every render would trap someone trying to leave it.
 *
 * Note there is usually only ONE message in this zone, because the approved failure
 * copy is deliberately single: one string for a wrong password and an unknown address
 * alike (R54). The summary is still the right shape, because it is where a rate-limit
 * notice and a service failure also land.
 */
export function AuthErrorSummary({ messages }: { messages: (string | null | undefined)[] }) {
  const items = messages.filter((m): m is string => Boolean(m));
  const ref = useRef<HTMLDivElement | null>(null);
  const announced = useRef<string>('');

  useEffect(() => {
    const key = items.join('|');
    if (!key || key === announced.current) return;
    announced.current = key;
    ref.current?.focus();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div ref={ref} tabIndex={-1} role="alert" className="auth-error-summary">
      <p className="auth-error-summary__heading">{AUTH_COPY.shared.errorSummaryHeading}</p>
      <ul>
        {items.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
