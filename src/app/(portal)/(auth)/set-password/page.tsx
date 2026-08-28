'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthFooterLinks } from '@/components/auth/AuthFooterLinks';
import { AuthErrorSummary } from '@/components/auth/AuthErrorSummary';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { usePasswordPolicy } from '@/hooks/usePasswordPolicy';
import { useAuthCopy } from '@/lib/i18n/authLocale';
import { routes } from '@/constants/routes';
import { navigateAfterAuth } from '@/lib/navigation/afterAuth';

/**
 * FIRST-TIME PASSWORD, from an invitation.
 *
 * ── THE SAME RULES AS /reset-password, IN THE SAME COMPONENTS (R52) ─────────
 * This route and `/reset-password` differ in a heading, a standfirst, the token they
 * carry, and where they go afterwards. They do NOT differ in what a valid password is:
 * both mount `PasswordField` + `PasswordRules` + `usePasswordPolicy`, which read
 * `lib/validation/password.ts`.
 *
 * That matters because this page previously validated at TEN characters inline, and
 * nothing else in the codebase agreed with it. Two pages differing only in a heading is
 * two places for the rules to drift, and this is where the drift already was.
 *
 * The transport — POST /api/portal/auth/set-password — is unchanged.
 *
 * The panel and heading sit ABOVE the Suspense boundary for the same reason as
 * /reset-password: the token comes from `useSearchParams`, and with the whole panel
 * inside a `null` fallback the static HTML had no heading and no fields in it.
 */
function SetPasswordInner() {
  const authCopy = useAuthCopy();
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const policy = usePasswordPolicy(password, confirm);
  const shortError = touched && policy.tooShort ? authCopy.reset.tooShort : null;
  const mismatchError = touched && !policy.tooShort && !policy.matches ? authCopy.reset.mismatch : null;

  async function submit() {
    setTouched(true);
    if (!policy.ready) return;

    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/portal/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        /* HARD navigation. This request created a session cookie, and Next's client
           router cache cannot see an httpOnly cookie -- a soft push can replay a
           pre-login middleware redirect. See lib/navigation/afterAuth.ts. */
        navigateAfterAuth();
        return;
      }
      /* One message for expired, consumed and unknown, and it offers a way forward. */
      setError(authCopy.reset.expired);
    } catch {
      setError(authCopy.shared.serviceFailure);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <p className="auth-heading__standfirst">{authCopy.setPassword.standfirst}</p>

      <AuthErrorSummary messages={[error, shortError, mismatchError]} />

      <div className="auth-fields">
        <PasswordField
          label={authCopy.reset.passwordLabel}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          error={shortError}
          autoFocus
        />
        <PasswordRules assessment={policy} />
        <PasswordField
          label={authCopy.reset.confirmLabel}
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          error={mismatchError}
          onSubmitKey={() => void submit()}
        />
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={() => void submit()} disabled={saving}>
        {saving ? authCopy.reset.submitting : authCopy.reset.submit}
      </Button>

      <AuthFooterLinks links={[{ label: authCopy.reset.back, href: routes.portalSignIn }]} />
    </>
  );
}

export default function SetPasswordPage() {
  const authCopy = useAuthCopy();
  return (
    <AuthPanel>
      <AuthHeading title={authCopy.setPassword.title} />
      <Suspense fallback={null}>
        <SetPasswordInner />
      </Suspense>
    </AuthPanel>
  );
}
