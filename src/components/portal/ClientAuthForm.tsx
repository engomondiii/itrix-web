'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { routes } from '@/constants/routes';

/** Sign-in form (§61). Delegates to the portal auth context; on success it routes
 *  into the workspace (respecting a `next` param). */
export function ClientAuthForm({ next }: { next?: string }) {
  const { signIn, loading, error } = usePortalAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  async function submit() {
    if (!email.trim() || !password) {
      setLocalError('Enter your email and password.');
      return;
    }
    setLocalError(null);
    await signIn(email.trim(), password, next);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-web-h2 text-indigo-950">{PORTAL_COPY.signIn.title}</h1>
      </div>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-secondary font-medium text-ink-900">{PORTAL_COPY.signIn.emailLabel}</span>
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-md border border-line bg-surface px-3 text-body text-ink-900 focus-visible:border-sapphire-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-secondary font-medium text-ink-900">{PORTAL_COPY.signIn.passwordLabel}</span>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void submit();
            }}
            className="h-11 rounded-md border border-line bg-surface px-3 text-body text-ink-900 focus-visible:border-sapphire-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
          />
        </label>
      </div>

      {(localError || error) ? <ErrorMessage>{localError ?? error}</ErrorMessage> : null}

      <Button variant="primary" size="lg" fullWidth onClick={submit} disabled={loading}>
        {loading ? 'Signing in…' : PORTAL_COPY.signIn.button}
      </Button>

      <div className="flex flex-col gap-1 text-secondary text-ink-500">
        <Link href={routes.portalForgotPassword} className="hover:text-sapphire-700">
          {PORTAL_COPY.signIn.forgot}
        </Link>
        <Link href={routes.review} className="hover:text-sapphire-700">
          {PORTAL_COPY.signIn.needAccess}
        </Link>
      </div>
    </div>
  );
}
