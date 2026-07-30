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
 * Sign up — invite redemption, and open registration behind a flag.
 *
 * ── WHY THIS IS NOT OPEN REGISTRATION BY DEFAULT ────────────────────────────
 * Accounts on this platform are EARNED: a visitor describes a problem, a brief is
 * delivered, and only then is an invite minted (State 5). A public form that opened a
 * workspace on demand would produce Clients with no Lead, no journey state and no
 * disclosure basis — which breaks value-first (R4), qualification (R2) and the
 * persona-keyed pitch model (R3). Architecture v2.8 §00.2 records all four
 * consequences and the decision that needs sign-off.
 *
 * So the default has two doors, and only one of them is a form:
 *
 *   DOOR 1  a code → the existing, assent-gated account-creation flow. This is the
 *           case the missing sign-up link was actually blocking: someone who was
 *           invited, closed the email, and typed the site name into a browser.
 *   DOOR 2  no form at all. It says a workspace opens after a short conversation and
 *           goes to the arrival composer, because the front door already IS the
 *           sign-up flow here.
 *
 * ── DOOR 1 HANDS OFF RATHER THAN DUPLICATING ────────────────────────────────
 * `/c/[token]/create-account` already collects the details, takes assent, records it
 * BEFORE the claim, and mints the JWT. Rebuilding that here would create a second
 * account-creation path — and therefore a second place for the assent gate to be
 * forgotten.
 */

export interface UseSignUpResult {
  /** Door 1. Navigates to the assent-gated flow when the code is usable. */
  redeem: (code: string) => Promise<void>;
  /** Open registration. Only reachable when the flag is on. */
  register: (payload: {
    email: string;
    password: string;
    fullName: string;
    organization: string;
    role?: string;
    assentVersions: LegalInstrumentVersion[];
  }) => Promise<boolean>;
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

  const register = useCallback(
    async (payload: Parameters<UseSignUpResult['register']>[0]): Promise<boolean> => {
      if (!siteConfig.featureFlags.openSignup) {
        /* Defence in depth. The route does not render the form, the proxy 404s, and
           this refuses — three layers, because the consequence of open registration
           arriving by accident is Clients with no journey behind them. */
        setError(AUTH_COPY.shared.serviceFailure);
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
      });
      setSubmitting(false);

      if (outcome.kind === 'ok') {
        trackEvent('auth.signup_door_chosen', { door: 'open', outcome: 'created' });
        router.push(routes.workspaceOverview);
        return true;
      }

      if (outcome.kind === 'rate_limited') {
        setRetryAfter(outcome.retryAfterSeconds);
        return false;
      }

      setError(AUTH_COPY.shared.serviceFailure);
      return false;
    },
    [router],
  );

  return {
    redeem,
    register,
    openSignupEnabled: siteConfig.featureFlags.openSignup,
    submitting,
    error,
    retryAfterSeconds,
    clearError: useCallback(() => setError(null), []),
  };
}
