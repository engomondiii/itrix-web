'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/authApi';
import { useAuthCopy } from '@/lib/i18n/authLocale';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { useLocaleStore } from '@/store/localeStore';
import type { LegalInstrumentVersion } from '@/lib/api/legalApi';

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  organization: string;
  role?: string;
  assentVersions: LegalInstrumentVersion[];
}

export interface UseSignUpResult {
  register: (payload: RegisterPayload) => Promise<boolean>;
  redeem: (code: string) => Promise<void>;
  openSignupEnabled: boolean;
  submitting: boolean;
  error: string | null;
  retryAfterSeconds: number | null;
  legalTermsChanged: boolean;
  clearError: () => void;
}

export function useSignUp(): UseSignUpResult {
  const authCopy = useAuthCopy();
  const locale = useLocaleStore((s) => s.locale);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfter] = useState<number | null>(null);
  const [legalTermsChanged, setLegalTermsChanged] = useState(false);

  const register = useCallback(
    async (payload: RegisterPayload): Promise<boolean> => {
      if (!siteConfig.featureFlags.openSignup) {
        setError(authCopy.signUp.serviceFailure);
        return false;
      }

      setSubmitting(true);
      setError(null);
      setRetryAfter(null);
      setLegalTermsChanged(false);
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
        trackEvent('auth.signed_up', {});
        trackEvent('auth.verification_sent', {});
        router.push(routes.portalVerifyEmail);
        return true;
      }

      if (outcome.kind === 'rate_limited') {
        setRetryAfter(outcome.retryAfterSeconds);
        return false;
      }

      if (outcome.kind === 'legal_terms_changed') {
        setLegalTermsChanged(true);
        setError(
          locale === 'ko'
            ? '검토하시는 동안 법적 약관이 변경되었습니다. 계속하기 전에 최신 버전을 다시 확인해 주세요.'
            : 'The legal terms changed while you were reviewing them. Please review the latest version before continuing.',
        );
        return false;
      }

      setError(authCopy.signUp.serviceFailure);
      return false;
    },
    [authCopy.signUp.serviceFailure, locale, router],
  );

  const redeem = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) {
        setError(authCopy.signUp.codeFailure);
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
        trackEvent('auth.signup_door_chosen', { door: 'invite', outcome: 'rejected' });
        setError(authCopy.signUp.codeFailure);
        return;
      }

      trackEvent('auth.invite_redeemed', {});
      router.push(result.redeemUrl);
    },
    [authCopy.signUp.codeFailure, router],
  );

  return {
    register,
    redeem,
    openSignupEnabled: siteConfig.featureFlags.openSignup,
    submitting,
    error,
    retryAfterSeconds,
    legalTermsChanged,
    clearError: useCallback(() => setError(null), []),
  };
}
