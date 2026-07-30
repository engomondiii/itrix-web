'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthFooterLinks } from '@/components/auth/AuthFooterLinks';
import { AuthErrorSummary } from '@/components/auth/AuthErrorSummary';
import { RateLimitNotice } from '@/components/auth/RateLimitNotice';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { usePasswordPolicy } from '@/hooks/usePasswordPolicy';
import { AUTH_COPY } from '@/lib/content/authCopy';
import { routes } from '@/constants/routes';

/**
 * CHOOSE A NEW PASSWORD, from a reset link.
 *
 * ── WHY THIS ROUTE EXISTS SEPARATELY FROM /set-password ─────────────────────
 * `/set-password` is first-time credential creation from an invitation; this is a reset
 * for an existing account. They differ in the token they carry, in what happens
 * afterwards (workspace versus sign-in), and in their copy — and in NOTHING ELSE. Both
 * mount `PasswordField` + `PasswordRules` + `usePasswordPolicy`, so the rules exist in
 * exactly one place (R52). If you find yourself editing a rule in one of them, edit
 * `lib/validation/password.ts` instead.
 *
 * ── THE FAILURE MESSAGE COVERS THREE CAUSES ─────────────────────────────────
 * Expired, already used, and unknown all produce one message, and it OFFERS A NEW LINK
 * rather than an explanation. Naming which cause it was would tell an attacker holding a
 * guessed token whether they had guessed a real one.
 *
 * ── THE SUCCESS MESSAGE NAMES THE SESSION INVALIDATION, ON PURPOSE ──────────
 * The backend signs out every other session on a password change (Backend v7.1 §15.3).
 * Being silently signed out of another device looks like a fault; being told reads as
 * the product working. The redirect waits a moment so the sentence can be read.
 *
 * ── THE PANEL AND HEADING SIT ABOVE THE SUSPENSE BOUNDARY ───────────────────
 * The token comes from `useSearchParams`, which forces its reader into a Suspense
 * boundary. With the whole panel inside it and a `null` fallback, the static HTML for
 * this route contained no heading and no fields at all.
 *
 * All three states of this page — form, success, unusable link — share the same `h1`, so
 * the panel and heading are hoisted out and only the token-dependent BODY is deferred.
 * The route now has its heading in the server response, and there is exactly one `h1`
 * whichever state renders.
 */
function ResetPasswordInner() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  const { confirm, confirmed, submitting, error, linkUnusable, retryAfterSeconds } = usePasswordReset();
  const [password, setPassword] = useState('');
  const [confirmValue, setConfirmValue] = useState('');
  const [touched, setTouched] = useState(false);

  const policy = usePasswordPolicy(password, confirmValue);

  const shortError = touched && policy.tooShort ? AUTH_COPY.reset.tooShort : null;
  const mismatchError = touched && !policy.tooShort && !policy.matches ? AUTH_COPY.reset.mismatch : null;

  function send() {
    setTouched(true);
    if (!policy.ready) return;
    void confirm(token, password);
  }

  if (confirmed) {
    return (
      <>
        <p className="auth-confirmation" role="status">
          {AUTH_COPY.reset.success}
        </p>
        <AuthFooterLinks links={[{ label: AUTH_COPY.reset.back, href: routes.portalSignIn }]} />
      </>
    );
  }

  /* No token at all is the same condition as a bad one, and gets the same message. */
  if (linkUnusable || !token) {
    return (
      <>
        <p className="auth-confirmation" role="status">
          {AUTH_COPY.reset.expired}
        </p>
        <AuthFooterLinks links={[{ label: AUTH_COPY.reset.back, href: routes.portalSignIn }]}>
          <p className="auth-footer__row">
            <Link href={routes.portalForgotPassword} className="auth-footer__link">
              {AUTH_COPY.reset.requestAgain}
            </Link>
          </p>
        </AuthFooterLinks>
      </>
    );
  }

  return (
    <>
      <p className="auth-heading__standfirst">{AUTH_COPY.reset.standfirst}</p>

      <AuthErrorSummary messages={[error, shortError, mismatchError]} />
      <RateLimitNotice retryAfterSeconds={retryAfterSeconds} />

      <div className="auth-fields">
        <PasswordField
          label={AUTH_COPY.reset.passwordLabel}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          error={shortError}
          autoFocus
        />
        {/* Shown ALWAYS, not as a correction after a failure. */}
        <PasswordRules assessment={policy} />
        <PasswordField
          label={AUTH_COPY.reset.confirmLabel}
          value={confirmValue}
          onChange={setConfirmValue}
          autoComplete="new-password"
          error={mismatchError}
          onSubmitKey={send}
        />
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={send} disabled={submitting}>
        {submitting ? AUTH_COPY.reset.submitting : AUTH_COPY.reset.submit}
      </Button>

      <AuthFooterLinks links={[{ label: AUTH_COPY.reset.back, href: routes.portalSignIn }]} />
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthPanel>
      {/* The heading is OUTSIDE the boundary, so it exists in the server response and
          there is exactly one h1 whichever state the body resolves to. */}
      <AuthHeading title={AUTH_COPY.reset.title} />
      <Suspense fallback={null}>
        <ResetPasswordInner />
      </Suspense>
    </AuthPanel>
  );
}
