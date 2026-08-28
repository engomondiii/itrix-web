'use client';

import { useCallback, useEffect, useState } from 'react';
import { authApi } from '@/lib/api/authApi';
import { portalApi } from '@/lib/api/portalApi';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * EMAIL CONFIRMATION (Architecture v2.9 §27.7, R66).
 *
 * ── WHAT IT GATES, AND WHAT IT MUST NOT ─────────────────────────────────────
 * Three things: reach above `controlled_public` (so, no NDA), any non-transactional
 * email, and being named on a commercial document. Nothing else.
 *
 * NOT signing in. NOT posting a turn. NOT receiving an answer. NOT keeping a thread.
 * Gating the composer on a mailbox round-trip would reintroduce exactly the wait open
 * registration exists to remove, for somebody who has already told us what they need.
 * That is why `unverified` drives a banner and never a block.
 *
 * ── UNKNOWN IS NOT UNVERIFIED ───────────────────────────────────────────────
 * `emailVerified` arrives from `client/me/` and is OPTIONAL, because Backend v7.2 Phase 4
 * is what adds it. When it is absent this hook reports `null` and the banner does not
 * render. Treating "we do not know" as "not confirmed" would put a permanent notice on
 * every existing customer's workspace the day this ships, which is worse than showing
 * nothing.
 */

export interface UseEmailVerificationResult {
  /** true / false when the backend told us; null when it did not. */
  verified: boolean | null;
  /** The address to name on the confirmation screen, when we have one. */
  email: string | null;
  confirm: (token: string) => Promise<'ok' | 'rejected' | 'unavailable'>;
  resend: () => Promise<void>;
  resent: boolean;
  busy: boolean;
  retryAfterSeconds: number | null;
}

export function useEmailVerification(): UseEmailVerificationResult {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [retryAfterSeconds, setRetryAfter] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data } = await portalApi.me();
      if (cancelled || !data) return;
      setEmail(data.email || null);
      setVerified(typeof data.emailVerified === 'boolean' ? data.emailVerified : null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const confirm = useCallback(async (token: string) => {
    setBusy(true);
    const outcome = await authApi.verifyEmail(token);
    setBusy(false);
    if (outcome.kind === 'ok') {
      setVerified(true);
      trackEvent('auth.verification_confirmed', {});
      return 'ok' as const;
    }
    if (outcome.kind === 'rate_limited') {
      setRetryAfter(outcome.retryAfterSeconds);
      return 'unavailable' as const;
    }
    return outcome.kind === 'rejected' ? ('rejected' as const) : ('unavailable' as const);
  }, []);

  const resend = useCallback(async () => {
    setBusy(true);
    setRetryAfter(null);
    const outcome = await authApi.resendVerification(email ?? undefined);
    setBusy(false);
    if (outcome.kind === 'rate_limited') {
      setRetryAfter(outcome.retryAfterSeconds);
      return;
    }
    /* Always reported as sent, whatever happened. The resend endpoint answers identically
       for an unknown, an unconfirmed and an already-confirmed address, and the surface must
       not be able to undo that by reporting more than it was told. */
    setResent(true);
    trackEvent('auth.verification_sent', {});
  }, [email]);

  return { verified, email, confirm, resend, resent, busy, retryAfterSeconds };
}
