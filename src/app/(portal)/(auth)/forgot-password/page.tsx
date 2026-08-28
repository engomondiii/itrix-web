'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthFooterLinks } from '@/components/auth/AuthFooterLinks';
import { RateLimitNotice } from '@/components/auth/RateLimitNotice';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { useAuthCopy } from '@/lib/i18n/authLocale';
import { routes } from '@/constants/routes';

/**
 * REQUEST A RESET LINK.
 *
 * ── THIS PAGE HAS NO FAILURE STATE, AND THAT IS THE DESIGN (R49) ────────────
 * The confirmation is shown whether or not the address has a workspace, whether or not
 * the email service is up, and whether or not the backend is deployed at all. There is
 * deliberately no "we couldn't find that address" branch — that single sentence would be
 * a free customer list, and it is the most common way this page is built wrongly.
 *
 * The wording carries the weight: "If that address has an itriX workspace, a reset link
 * is on its way." It is honest, it confirms nothing, and it does not read as evasive.
 * DO NOT change it to "We've sent you a link" — that confirms the account exists.
 *
 * The only state that interrupts the confirmation is RATE LIMITING, which is a fact
 * about the request rather than about the account.
 *
 * v3.1's version already got the confirmation right. What Phase 4 adds is the shell, the
 * link back, the rate-limit notice, and a proxy that cannot become the oracle this page
 * carefully is not.
 */
export default function ForgotPasswordPage() {
  const authCopy = useAuthCopy();
  const { request, requested, submitting, retryAfterSeconds } = usePasswordReset();
  const [email, setEmail] = useState('');

  if (requested) {
    return (
      <AuthPanel>
        <AuthHeading title={authCopy.forgot.title} />
        <p className="auth-confirmation" role="status">
          {authCopy.forgot.confirmation}
        </p>
        <p className="auth-confirmation__follow">{authCopy.forgot.confirmationFollowOn}</p>
        <AuthFooterLinks links={[{ label: authCopy.forgot.back, href: routes.portalSignIn }]} />
      </AuthPanel>
    );
  }

  return (
    <AuthPanel>
      <AuthHeading title={authCopy.forgot.title} standfirst={authCopy.forgot.standfirst} />

      <RateLimitNotice retryAfterSeconds={retryAfterSeconds} />

      <div className="auth-fields">
        <div className="auth-field">
          <label htmlFor="forgot-email" className="auth-field__label">
            {authCopy.forgot.emailLabel}
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            autoComplete="username"
            inputMode="email"
            autoCapitalize="off"
            spellCheck={false}
            className="auth-field__input"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && email.trim()) void request(email);
            }}
          />
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => void request(email)}
        disabled={submitting || !email.trim()}
      >
        {submitting ? authCopy.forgot.submitting : authCopy.forgot.submit}
      </Button>

      <AuthFooterLinks links={[{ label: authCopy.forgot.back, href: routes.portalSignIn }]} />
    </AuthPanel>
  );
}
