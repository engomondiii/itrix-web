'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/authApi';
import { AUTH_COPY } from '@/lib/content/authCopy';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { LegalInstrumentVersion } from '@/lib/api/legalApi';

/**
 * Sign up — open registration, and invitation redemption (Architecture v2.9 §27).
 *
 * ── WHAT CHANGED FROM v7.0 ──────────────────────────────────────────────────
 * `register()` no longer refuses. v7.0 had it guard on `featureFlags.openSignup` as the
 * third of three layers keeping open registration switched off; the flag now DEFAULTS ON
 * and that branch inverts into the kill-switch path (§27.10). With the switch thrown the
 * page does not render the form, this refuses, and the proxy 404s — the same three layers,
 * pointing the other way.
 *
 * `register()` also carries the ASSENT VERSIONS. They are sent with the credentials and
 * the backend writes the record inside the transaction that creates the Client (R62).
 * The v7.0 component POSTed them first, to an endpoint that authenticates on the client
 * plane — before registration there is no client-JWT and no Client for the record to
 * attach to, so that sequence could not work here.
 *
 * ── WHAT DELIBERATELY DID NOT CHANGE ────────────────────────────────────────
 * `redeem()`. The lookup, the single failure message for unknown/used/expired, and the
 * hand-off to `/invite/[token]/create-account` all work and are not being rewritten because
 * the page around them moved.
 *
 * ── WHAT THIS HOOK CANNOT LEARN ─────────────────────────────────────────────
 * Whether the address was already in use. The proxy collapses every non-rate-limited
 * outcome into one response (R64), so `register()` resolving `true` means "the request was
 * accepted", never "an account was created". The screen it navigates to is written to be
 * true either way.
 */

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  organization: string;
  role?: string;
  /** The versions the visitor actually saw. Recorded server-side, in one transaction. */
  assentVersions: LegalInstrumentVersion[];
}

export interface UseSignUpResult {
  /** Open registration. Navigates to the confirmation screen when accepted. */
  register: (payload: RegisterPayload) => Promise<boolean>;
  /** The invitation code. Navigates to the assent-gated claim flow when usable. */
  redeem: (code: string) => Promise<void>;
  openSignupEnabled: boolean;
  submitting: boolean;
  error: string | null;
  retryAfterSeconds: number | null;
  clearError: () => void;
}

export function useSignUp(): UseSignUpResult {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfter] = useState<number | null>(null);

  const register = useCallback(
    async (payload: RegisterPayload): Promise<boolean> => {
      if (!siteConfig.featureFlags.openSignup) {
        /* The kill switch is thrown. The page does not render the form, so reaching here
           means something called the hook directly — refuse rather than post. */
        setError(AUTH_COPY.signUp.serviceFailure);
        return false;
      }

      setSubmitting(true);
      setError(null);
      setRetryAfter(null);
      const outcome = await authApi.register({
        email: payload.email.trim(),
        password: payload.password,
        fullName: payload.fullName.trim(),
        organization: payload.organization.trim(),
        role: payload.role?.trim() || undefined,
        assent: payload.assentVersions,
      });
      setSubmitting(false);

      if (outcome.kind === 'ok') {
        /* No address, no organisation, no indication of whether the account already
           existed. Telemetry must not be able to answer "is this person a customer". */
        trackEvent('auth.signed_up', {});
        trackEvent('auth.verification_sent', {});
        router.push(routes.portalVerifyEmail);
        return true;
      }

      if (outcome.kind === 'rate_limited') {
        setRetryAfter(outcome.retryAfterSeconds);
        return false;
      }

      /* Honest failure. NOT a fake success: telling somebody they have a workspace when
         nothing was created sends them to a sign-in page that will reject them. The reset
         REQUEST proxy degrades to accepted because a missing account and a broken service
         must be indistinguishable there; registration has no such requirement and must
         not borrow the pattern (Surface 1 v8.0 §16.7). */
      setError(AUTH_COPY.signUp.serviceFailure);
      return false;
    },
    [router],
  );

  const redeem = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) {
        setError(AUTH_COPY.signUp.codeFailure);
        return;
      }

      setSubmitting(true);
      setError(null);
      setRetryAfter(null);
      const { outcome, result } = await authApi.lookupInvite(trimmed);
      setSubmitting(false);

      if (outcome.kind === 'rate_limited') {
        setRetryAfter(outcome.retryAfterSeconds);
        return;
      }

      if (outcome.kind !== 'ok' || !result?.redeemUrl) {
        /* One message for unknown, used and expired. No code in the event. */
        trackEvent('auth.signup_door_chosen', { door: 'invite', outcome: 'rejected' });
        setError(AUTH_COPY.signUp.codeFailure);
        return;
      }

      trackEvent('auth.invite_redeemed', {});
      router.push(result.redeemUrl);
    },
    [router],
  );

  return {
    register,
    redeem,
    openSignupEnabled: siteConfig.featureFlags.openSignup,
    submitting,
    error,
    retryAfterSeconds,
    clearError: useCallback(() => setError(null), []),
  };
}
