'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { routes } from '@/constants/routes';

/**
 * Forgot-password request (§61). We always show the same neutral confirmation
 * regardless of whether the email is registered (no account enumeration). The reset
 * itself is handled by the backend; this posts the request and confirms.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function submit() {
    // Fire-and-forget to the backend; the confirmation is intentionally the same
    // whether or not the address exists.
    try {
      await fetch('/api/portal/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
    } catch {
      /* ignore — always show the same confirmation */
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-web-h3 text-structure-900">Check your inbox</h1>
        <p className="reading text-ink-secondary">{PORTAL_COPY.forgotPassword.confirmation}</p>
        <Link href={routes.portalSignIn} className="text-secondary font-medium text-ink-primary hover:text-ink-primary">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-web-h2 text-structure-900">Reset your password</h1>
      <p className="reading text-ink-secondary">{PORTAL_COPY.forgotPassword.intro}</p>
      <label className="flex flex-col gap-1.5">
        <span className="text-secondary font-medium text-ink-primary">{PORTAL_COPY.signIn.emailLabel}</span>
        <input
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-md border border-border-medium bg-surface px-3 text-body text-ink-primary focus-visible:border-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary"
        />
      </label>
      <Button variant="primary" size="lg" fullWidth onClick={submit} disabled={!email.trim()}>
        {PORTAL_COPY.forgotPassword.button}
      </Button>
      <Link href={routes.portalSignIn} className="text-secondary text-ink-secondary hover:text-ink-primary">
        Back to sign in
      </Link>
    </div>
  );
}
