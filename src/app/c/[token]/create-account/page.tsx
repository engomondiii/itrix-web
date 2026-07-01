'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ConfidentialityNote } from '@/components/homepage/ConfidentialityNote';
import { JourneyProvider } from '@/context/JourneyContext';
import { RevealGate } from '@/components/client-page/RevealGate';
import { portalApi } from '@/lib/api/portalApi';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/**
 * The account-creation page (reveal ②→③). It is gated by RevealGate so only a holder
 * of an unlocked account_invite (INVITED) sees the form. On submit it posts to the
 * real invite-claim proxy (POST /api/accounts/invite/[token]/claim), which has Django
 * create the Client and set an httpOnly client-JWT — then routes into the portal (or
 * to set-password first). When the portal flag is OFF, it shows a "we'll be in touch"
 * fallback instead of creating anything.
 */
function CreateAccountInner({ token }: { token: string }) {
  const router = useRouter();
  const portalEnabled = siteConfig.featureFlags.clientPortal;
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const value = email.trim();
    if (!/.+@.+\..+/.test(value)) {
      setError('Enter a valid email so the team can reach you.');
      return;
    }
    setError(null);

    // Portal not switched on yet — record intent and show the graceful fallback.
    if (!portalEnabled) {
      trackEvent('account.invite_fallback', { token, hasEmail: true });
      setFallback(true);
      return;
    }

    setSubmitting(true);
    const res = await portalApi.claimInvite(token, { email: value });
    setSubmitting(false);

    if (res.data) {
      trackEvent('account.invite_claimed', { token, clientId: res.data.client.id });
      if (res.data.requiresPasswordSet) {
        router.push(`${routes.portalSetPassword}?token=${encodeURIComponent(token)}`);
      } else {
        router.push(routes.workspaceOverview);
      }
      return;
    }
    // Claim failed (expired/used/unreachable) — fall back to "we'll be in touch".
    trackEvent('account.invite_fallback', { token, reason: res.error ?? 'claim_failed' });
    setFallback(true);
  }

  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-lg">
        <RevealGate
          surface="account_invite"
          fallback={
            <Card variant="warm" className="flex flex-col gap-3 text-center">
              <SectionLabel>Not yet available</SectionLabel>
              <h1 className="text-web-h3 text-indigo-950">Your workspace isn’t open yet</h1>
              <p className="reading text-ink-700">
                A private workspace becomes available once the team has reviewed your case. Return to
                your review — you’ll see the option there the moment it’s ready.
              </p>
              <div className="pt-1">
                <Link href={routes.clientPage(token)}>
                  <Button variant="secondary">Back to my review</Button>
                </Link>
              </div>
            </Card>
          }
        >
          {fallback ? (
            <Card variant="featured" className="flex flex-col gap-3 text-center">
              <SectionLabel tone="gold">Thank you</SectionLabel>
              <h1 className="text-web-h3 text-indigo-950">{PORTAL_COPY.invite.fallbackTitle}</h1>
              <p className="reading text-ink-700">{PORTAL_COPY.invite.fallbackBody}</p>
              <div className="pt-1">
                <Link href={routes.clientPage(token)}>
                  <Button variant="secondary">Back to my review</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card variant="featured" className="flex flex-col gap-4">
              <div>
                <SectionLabel tone="gold">Create your itriX workspace</SectionLabel>
                <h1 className="mt-2 text-web-h3 text-indigo-950">Continue privately with the team</h1>
                <p className="reading mt-2 text-ink-700">
                  A workspace keeps this conversation, lets you share documents under NDA, and tracks
                  next steps with the itriX team.
                </p>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-secondary font-medium text-ink-900">Work email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11 rounded-md border border-line bg-surface px-3 text-body text-ink-900 placeholder:text-ink-400 focus-visible:border-sapphire-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
                />
              </label>
              {error ? <ErrorMessage>{error}</ErrorMessage> : null}
              <Button variant="gold" size="md" onClick={submit} disabled={submitting}>
                {submitting ? PORTAL_COPY.invite.accepting : 'Create workspace'}
              </Button>
              <ConfidentialityNote />
            </Card>
          )}
        </RevealGate>
      </div>
    </section>
  );
}

export default function CreateAccountPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  return (
    <JourneyProvider token={token}>
      <CreateAccountInner token={token} />
    </JourneyProvider>
  );
}
