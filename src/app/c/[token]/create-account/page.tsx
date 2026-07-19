'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ConfidentialityNote } from '@/components/center/ConfidentialityNote';
import { JourneyProvider } from '@/context/JourneyContext';
import { RevealGate } from '@/components/client-page/RevealGate';
import { portalApi } from '@/lib/api/portalApi';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/**
 * The account-creation page (reveal ②→③). Gated by RevealGate so only a holder of an
 * unlocked account_invite (INVITED) sees the form.
 *
 * v4.1 — the visitor now completes the FULL signup themselves: their details plus a
 * password they choose. On submit it posts to the invite-claim proxy
 * (POST /api/accounts/invite/[token]/claim) WITH the password, so Django creates a
 * fully-credentialed Client and mints a client-JWT. The proxy stores that JWT in an
 * httpOnly cookie, so the visitor lands directly inside their workspace — no "we'll
 * be in touch", no separate email round-trip. When the portal flag is OFF, the same
 * form shows the graceful fallback so the reveal never dead-ends.
 */
function CreateAccountInner({ token }: { token: string }) {
  const router = useRouter();
  const portalEnabled = siteConfig.featureFlags.clientPortal;

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Tell us who to address in the workspace.';
    if (!organization.trim()) next.organization = 'Add your company or organization.';
    if (!/.+@.+\..+/.test(email.trim())) next.email = 'Enter a valid work email.';
    if (password.length < 10) next.password = 'Use at least 10 characters.';
    if (password !== confirm) next.confirm = 'Those passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!validate()) return;

    // Portal not switched on yet — record intent and show the graceful fallback.
    if (!portalEnabled) {
      trackEvent('account.invite_fallback', { token, hasEmail: true });
      setFallback(true);
      return;
    }

    setSubmitting(true);
    const res = await portalApi.claimInvite(token, {
      email: email.trim(),
      password,
      full_name: fullName.trim(),
      organization: organization.trim(),
      role: role.trim(),
    });
    setSubmitting(false);

    if (res.data) {
      trackEvent('account.invite_claimed', { token, clientId: res.data.client.id });
      // Claiming with a password mints a client-JWT (stored httpOnly by the proxy),
      // so the workspace is immediately authenticated. If for any reason the backend
      // still asks for a password set, honour that; otherwise go straight in.
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
              <h1 className="text-web-h3 text-structure-900">Your workspace isn’t open yet</h1>
              <p className="reading text-ink-secondary">
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
              <h1 className="text-web-h3 text-structure-900">{PORTAL_COPY.invite.fallbackTitle}</h1>
              <p className="reading text-ink-secondary">{PORTAL_COPY.invite.fallbackBody}</p>
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
                <h1 className="mt-2 text-web-h3 text-structure-900">Continue privately with the team</h1>
                <p className="reading mt-2 text-ink-secondary">
                  Set up your private workspace to keep this conversation, share documents under NDA,
                  and track next steps with the itriX team.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Input
                  label="Full name"
                  value={fullName}
                  autoComplete="name"
                  placeholder="Your name"
                  error={errors.fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Company / organization"
                  value={organization}
                  autoComplete="organization"
                  placeholder="Your organization"
                  error={errors.organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
                <Input
                  label="Role (optional)"
                  value={role}
                  autoComplete="organization-title"
                  placeholder="e.g. Head of Infrastructure"
                  onChange={(e) => setRole(e.target.value)}
                />
                <Input
                  label="Work email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder="you@company.com"
                  error={errors.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  autoComplete="new-password"
                  placeholder="At least 10 characters"
                  hint="You’ll use this to sign back into your workspace."
                  error={errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  value={confirm}
                  autoComplete="new-password"
                  error={errors.confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

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
