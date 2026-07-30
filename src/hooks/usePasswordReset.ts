'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/authApi';
import { AUTH_COPY } from '@/lib/content/authCopy';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * The password reset flow, as two explicit steps.
 *
 * ── REQUEST AND CONFIRM BEHAVE DIFFERENTLY, ON PURPOSE ──────────────────────
 *
 * REQUEST always succeeds from the visitor's side. Whether the address has a workspace,
 * whether the email service is up, whether the backend is deployed at all — the
 * confirmation is the same sentence, and it is written to be true in every one of those
 * cases (R49). A distinguishable response here is a free customer list.
 *
 * CONFIRM reports failure honestly. The visitor is holding a link they believe works;
 * telling them nothing would leave them stuck on a screen that appears broken. It still
 * does not distinguish expired from consumed from unknown — one message covers all
 * three, and it offers a new link rather than an explanation.
 *
 * ── WHAT THE SUCCESS MESSAGE SAYS, AND WHY ──────────────────────────────────
 * That other sessions were signed out. The backend does that on every password change
 * (Backend v7.1 §15.3 property 3); being silently signed out of another device looks
 * like a fault, and being told reads as the product working.
 */

export interface UsePasswordResetResult {
  /** Step 1. Resolves when the confirmation may be shown — which is always. */
  request: (email: string) => Promise<void>;
  requested: boolean;
  /** Step 2. */
  confirm: (token: string, password: string) => Promise<void>;
  confirmed: boolean;
  submitting: boolean;
  /** Set only by `confirm`. `request` has no failure state by design. */
  error: string | null;
  /** True when the link itself is the problem, so the UI can offer a new one. */
  linkUnusable: boolean;
  retryAfterSeconds: number | null;
}

export function usePasswordReset(): UsePasswordResetResult {
  const router = useRouter();
  const [requested, setRequested] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkUnusable, setLinkUnusable] = useState(false);
  const [retryAfterSeconds, setRetryAfter] = useState<number | null>(null);

  const request = useCallback(async (email: string) => {
    setSubmitting(true);
    setRetryAfter(null);
    const outcome = await authApi.requestReset(email.trim());
    setSubmitting(false);

    if (outcome.kind === 'rate_limited') {
      setRetryAfter(outcome.retryAfterSeconds);
      return;
    }

    /* No email in the event, and no indication of whether one was sent. */
    trackEvent('auth.reset_requested', {});
    setRequested(true);
  }, []);

  const confirm = useCallback(
    async (token: string, password: string) => {
      setSubmitting(true);
      setError(null);
      setLinkUnusable(false);
      setRetryAfter(null);

      const outcome = await authApi.confirmReset(token, password);
      setSubmitting(false);

      if (outcome.kind === 'ok') {
        trackEvent('auth.reset_completed', {});
        setConfirmed(true);
        /* A moment on the success message, which names the session invalidation, then
           to sign-in. Redirecting instantly would hide the one thing worth reading. */
        setTimeout(() => router.push(routes.portalSignIn), 2600);
        return;
      }

      if (outcome.kind === 'rate_limited') {
        setRetryAfter(outcome.retryAfterSeconds);
        return;
      }

      if (outcome.kind === 'rejected') {
        /* One message for expired, consumed and unknown alike. */
        setLinkUnusable(true);
        setError(AUTH_COPY.reset.expired);
        return;
      }

      setError(AUTH_COPY.shared.serviceFailure);
    },
    [router],
  );

  return {
    request, requested, confirm, confirmed,
    submitting, error, linkUnusable, retryAfterSeconds,
  };
}
