'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { routes } from '@/constants/routes';

function SetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (password.length < 10) {
      setError('Use at least 10 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Those passwords do not match.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/portal/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        router.push(routes.workspaceOverview);
        return;
      }
      setError('That link may have expired. Request a new one from sign in.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-web-h2 text-indigo-950">{PORTAL_COPY.setPassword.title}</h1>
        <p className="reading mt-2 text-ink-700">{PORTAL_COPY.setPassword.intro}</p>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-secondary font-medium text-ink-900">{PORTAL_COPY.setPassword.passwordLabel}</span>
        <input
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-md border border-line bg-surface px-3 text-body text-ink-900 focus-visible:border-sapphire-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-secondary font-medium text-ink-900">{PORTAL_COPY.setPassword.confirmLabel}</span>
        <input
          type="password"
          value={confirm}
          autoComplete="new-password"
          onChange={(e) => setConfirm(e.target.value)}
          className="h-11 rounded-md border border-line bg-surface px-3 text-body text-ink-900 focus-visible:border-sapphire-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
        />
      </label>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      <Button variant="primary" size="lg" fullWidth onClick={submit} disabled={saving}>
        {saving ? 'Setting…' : PORTAL_COPY.setPassword.button}
      </Button>
    </div>
  );
}

/** First-time password set (§61 companion). */
export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordInner />
    </Suspense>
  );
}
