'use client';

import { useEffect, useState } from 'react';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthFooterLinks } from '@/components/auth/AuthFooterLinks';
import { RateLimitNotice } from '@/components/auth/RateLimitNotice';
import { Button } from '@/components/ui/Button';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { useAuthCopy } from '@/lib/i18n/authLocale';
import { routes } from '@/constants/routes';

type Phase = 'idle' | 'confirming' | 'done' | 'expired' | 'unavailable';

/**
 * CONFIRM AN EMAIL ADDRESS (Playbook v1.9 §18G).
 *
 * ── THE TOKEN IS READ FROM `window.location`, NOT `useSearchParams` ─────────
 * Deliberately, and this is the second time this exact trap has been walked into on this
 * surface. In Phase 4, `/sign-in` and `/reset-password` used `useSearchParams`, which
 * forces a Suspense boundary — and with `fallback={null}` the PRERENDERED HTML CONTAINED
 * NO PANEL AND NO HEADING AT ALL. The acceptance criterion "exactly one h1 per route" was
 * passing against a document that had none.
 *
 * So the panel, the heading and the resend control are rendered unconditionally, and the
 * token is picked up in an effect. Static HTML has the whole screen; the token only
 * affects what happens next.
 */
export default function VerifyEmailPage() {
  const authCopy = useAuthCopy();
  const { confirm, resend, resent, email, busy, retryAfterSeconds } = useEmailVerification();
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) return;
    let cancelled = false;

    /* Deferred to a microtask rather than run synchronously in the effect body.
       `react-hooks/set-state-in-effect` flags the synchronous version, and it is right to:
       a setState in the effect's synchronous phase forces an immediate second render before
       the browser has painted the first one. Deferring costs nothing here, because the
       screen renders completely without a token and the token only changes what happens
       next. */
    void Promise.resolve().then(async () => {
      if (cancelled) return;
      setPhase('confirming');
      const outcome = await confirm(token);
      if (cancelled) return;
      setPhase(outcome === 'ok' ? 'done' : outcome === 'rejected' ? 'expired' : 'unavailable');
    });

    return () => {
      cancelled = true;
    };
  }, [confirm]);

  return (
    <AuthPanel>
      <AuthHeading
        title={authCopy.verify.title}
        standfirst={email ? authCopy.verify.standfirst(email) : authCopy.verify.standfirstNoAddress}
      />

      <RateLimitNotice retryAfterSeconds={retryAfterSeconds} />

      {phase === 'confirming' ? (
        <p className="verify-status" role="status">
          {authCopy.verify.confirming}
        </p>
      ) : null}

      {phase === 'done' ? (
        <p className="verify-status" role="status">
          {authCopy.verify.success}
        </p>
      ) : null}

      {phase === 'expired' ? (
        <p className="verify-status verify-status--warn" role="status">
          {authCopy.verify.expired}
        </p>
      ) : null}

      {phase === 'unavailable' ? (
        <p className="verify-status verify-status--warn" role="status">
          {authCopy.shared.serviceFailure}
        </p>
      ) : null}

      {phase !== 'done' ? (
        <div className="verify-actions">
          {/* THE COMPLETE LIST of what confirmation gates. Never "for full access". */}
          <p className="verify-unlocks">{authCopy.verify.unlocks}</p>
          {resent ? (
            <p className="verify-status" role="status">
              {authCopy.verify.resendConfirmation}
            </p>
          ) : (
            <Button variant="secondary" size="md" disabled={busy} onClick={() => void resend()}>
              {busy ? authCopy.verify.resending : authCopy.verify.resend}
            </Button>
          )}
        </div>
      ) : null}

      <AuthFooterLinks
        links={[{ label: authCopy.verify.back, href: routes.portalSignIn }]}
      />
    </AuthPanel>
  );
}
