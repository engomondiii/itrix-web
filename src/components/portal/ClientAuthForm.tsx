'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthFooterLinks } from '@/components/auth/AuthFooterLinks';
import { AuthErrorSummary } from '@/components/auth/AuthErrorSummary';
import { RateLimitNotice } from '@/components/auth/RateLimitNotice';
import { PasswordField } from '@/components/auth/PasswordField';
import { useSignIn } from '@/hooks/useSignIn';
import { useAuthCopy } from '@/lib/i18n/authLocale';
import { routes } from '@/constants/routes';

/**
 * The sign-in form.
 *
 * ── REBUILT IN PLACE, NOT REPLACED ──────────────────────────────────────────
 * Phase 4 keeps this component and its transport — `usePortalAuth().signIn` posting to
 * /api/portal/auth/login, with the client-JWT left in an httpOnly cookie the browser
 * cannot read. That path works and is not being rewritten for cosmetics. What changes is
 * everything around it.
 *
 * ── THE THREE FIXES ─────────────────────────────────────────────────────────
 *
 * 1. IT LOOKS LIKE THE FRONT DOOR. Same glass panel as the arrival composer, inside the
 *    same shell, with the same wordmark above it.
 *
 * 2. IT IS NOT A DEAD END (R47). v3.1 offered "forgot your password" and a "need access"
 *    link into the review flow — but nothing for the person holding an invitation who has
 *    no account yet, which is exactly who arrives at a sign-in page they cannot use.
 *    `Sign up` is now the second link.
 *
 * 3. THE FAILURE MESSAGE IS SINGLE (R54). One string for a wrong password and for an
 *    address we have never seen. `useSignIn` owns it so a component cannot helpfully
 *    split it later.
 *
 * ── AND ONE THING IT DELIBERATELY DOES NOT DO ───────────────────────────────
 * There is no greeting, and none appears once the email is recognised (R57). A "welcome
 * back" that arrives on recognition is an enumeration oracle with a friendly face.
 */
/**
 * Where to go after signing in.
 *
 * Read from `window.location` at SUBMIT time rather than through `useSearchParams`,
 * because `useSearchParams` would put this whole panel behind a Suspense boundary and
 * leave the static HTML for /sign-in with no heading and no fields in it — a flash of
 * empty panel on the screen a customer sees every morning.
 *
 * The `/workspace` prefix check is not cosmetic: an unvalidated `next` is an open
 * redirect, and the one after a successful sign-in is the most valuable kind to have.
 * `PortalAuthContext` re-checks the same prefix, so this is defence in depth rather than
 * the only guard.
 */
function nextFromLocation(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const raw = new URLSearchParams(window.location.search).get('next');
  if (!raw) return undefined;
  return raw.startsWith('/workspace') ? raw : undefined;
}

export function ClientAuthForm({ next }: { next?: string } = {}) {
  const authCopy = useAuthCopy();
  const { submit, submitting, error, retryAfterSeconds, clearError } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function send() {
    void submit(email, password, next ?? nextFromLocation());
  }

  return (
    <AuthPanel>
      <AuthHeading title={authCopy.signIn.title} standfirst={authCopy.signIn.standfirst} />

      <AuthErrorSummary messages={[error]} />
      <RateLimitNotice retryAfterSeconds={retryAfterSeconds} />

      <div className="auth-fields">
        <div className="auth-field">
          <label htmlFor="signin-email" className="auth-field__label">
            {authCopy.signIn.emailLabel}
          </label>
          <input
            id="signin-email"
            type="email"
            value={email}
            /* `username`, not `email`: it is what password managers key a credential
               pair on, and the wrong token is why a manager offers nothing here. */
            autoComplete="username"
            inputMode="email"
            autoCapitalize="off"
            spellCheck={false}
            className="auth-field__input"
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) clearError();
            }}
          />
        </div>

        <PasswordField
          label={authCopy.signIn.passwordLabel}
          value={password}
          onChange={(v) => {
            setPassword(v);
            if (error) clearError();
          }}
          autoComplete="current-password"
          onSubmitKey={send}
        />
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={send} disabled={submitting}>
        {submitting ? authCopy.signIn.submitting : authCopy.signIn.submit}
      </Button>

      <AuthFooterLinks
        links={[
          { label: authCopy.signIn.forgot, href: routes.portalForgotPassword },
          {
            prefix: authCopy.signIn.noAccountPrefix,
            label: authCopy.signIn.noAccountLink,
            href: routes.portalSignUp,
          },
        ]}
      />
    </AuthPanel>
  );
}
