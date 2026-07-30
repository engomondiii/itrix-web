'use client';

import { useCallback, useState } from 'react';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { AUTH_COPY } from '@/lib/content/authCopy';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * Sign in — the message layer over the one credential path.
 *
 * ── THERE IS EXACTLY ONE CREDENTIAL PATH, AND THIS IS NOT A SECOND ONE ──────
 * The transport is `PortalAuthContext.signIn`, which posts to
 * /api/portal/auth/login, receives the client profile, and leaves the client-JWT in an
 * httpOnly cookie the browser cannot read. That is unchanged and is not being rewritten
 * for cosmetics.
 *
 * What this hook owns is the WORDING and the rate-limit surface — the two things the
 * v3.1 form got wrong:
 *
 *   · ONE FAILURE MESSAGE for a wrong password and an unknown address (R54). The
 *     context's own message was already generic; this makes the approved copy the only
 *     string a component can reach, so a future edit cannot helpfully split it.
 *   · A STATED WAIT under rate limiting (R55), rather than a form that silently stops
 *     working and teaches people to retry harder.
 *
 * And it emits telemetry that CANNOT answer "is this address a customer": the failure
 * event carries no email and no reason.
 */
export interface UseSignInResult {
  submit: (email: string, password: string, next?: string) => Promise<void>;
  submitting: boolean;
  /** The single approved failure message, or null. */
  error: string | null;
  /** Seconds to wait, when rate limited. */
  retryAfterSeconds: number | null;
  clearError: () => void;
}

export function useSignIn(): UseSignInResult {
  const { signIn, retryAfterSeconds } = usePortalAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (email: string, password: string, next?: string) => {
      /* Locally empty fields are still the same single message. Saying "enter your
         email" for one field and "those details did not match" for the other is a
         difference an attacker can read. */
      if (!email.trim() || !password) {
        setError(AUTH_COPY.signIn.failure);
        return;
      }

      setError(null);
      setSubmitting(true);
      const ok = await signIn(email.trim(), password, next);
      setSubmitting(false);

      if (ok) {
        trackEvent('auth.signed_in', {});
        return;
      }

      /* No email, no reason, no indication of whether the address exists. */
      trackEvent('auth.sign_in_failed', {});
      setError(AUTH_COPY.signIn.failure);
    },
    [signIn],
  );

  return {
    submit,
    submitting,
    error,
    retryAfterSeconds: retryAfterSeconds ?? null,
    clearError: useCallback(() => setError(null), []),
  };
}
