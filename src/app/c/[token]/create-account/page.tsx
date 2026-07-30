'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ConfidentialityNote } from '@/components/center/ConfidentialityNote';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { AssentCheckbox } from '@/components/legal/AssentCheckbox';
import { AssentSummary } from '@/components/legal/AssentSummary';
import { usePasswordPolicy } from '@/hooks/usePasswordPolicy';
import { useLegalAssent } from '@/hooks/useLegalAssent';
import { AUTH_COPY } from '@/lib/content/authCopy';
import { ASSENT_COPY } from '@/lib/content/legalCopy';
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
 *
 * ── v6.0 PHASE 3: THIS IS WHERE ASSENT IS TAKEN (R44) ───────────────────────
 * An explicit, UNTICKED checkbox naming the Terms and the Privacy Policy WITH THEIR
 * VERSION IDENTIFIERS, recorded against the Client with a timestamp
 * (Architecture v2.8 §19.10).
 *
 * It is taken HERE and, from v7.0, on every other path that creates a Client. Never at
 * the first sentence — gating the composer behind a click-wrap would ask for a commitment
 * before anything had been given, which is the one rule this surface is built on.
 * Browsing and the first turn are governed by NOTICE: the pinned legal strip plus the
 * confidentiality line.
 *
 * THE ORDER MATTERS. Assent is recorded BEFORE the invite is claimed, so a Client is
 * never created without it. If the record fails, nothing else happens and the visitor is
 * told — an account that exists without a recorded assent is precisely the state §19.10
 * exists to prevent, and it cannot be repaired afterwards by guessing what they read.
 *
 * ── v7.0 PHASE 4: ONE PASSWORD CONTRACT (R52) ───────────────────────────────
 * This page used to validate at TEN characters in its own `validate()`, and nothing else
 * in the codebase agreed with it. It now mounts `PasswordField` + `PasswordRules` and
 * reads the policy from `lib/validation/password.ts` — the same components and the same
 * numbers as set-password and reset-password.
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

  /* v8.0 — the versions travel in the CLAIM payload and the backend records them inside the
     transaction that creates the Client (R62). `record()` therefore no longer POSTs: it
     confirms the gate was satisfied. The separate POST produced a second record, because
     `claim_invite()` has written one in-transaction since Backend v7.1 Phase 3. */
  const assent = useLegalAssent({ transport: 'in_payload' });
  const policy = usePasswordPolicy(password, confirm);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Tell us who to address in the workspace.';
    if (!organization.trim()) next.organization = 'Add your company or organization.';
    if (!/.+@.+\..+/.test(email.trim())) next.email = 'Enter a valid work email.';
    if (policy.tooShort) next.password = AUTH_COPY.reset.tooShort;
    else if (!policy.matches) next.confirm = AUTH_COPY.reset.mismatch;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!validate()) return;

    /* THE GATE. Blocking locally first means the visitor is told what to do before any
       request is made, rather than after one fails. */
    if (!assent.accepted) {
      setErrors((prev) => ({ ...prev, assent: ASSENT_COPY.blocked }));
      trackEvent('assent.blocked', {});
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.assent;
      return next;
    });

    /* Recorded BEFORE the claim, so a Client is never created without it. A failure stops
       here and says so — it is not swallowed and the claim does not proceed. */
    const recorded = await assent.record(token);
    if (!recorded) {
      setErrors((prev) => ({ ...prev, assent: assent.error ?? ASSENT_COPY.blocked }));
      return;
    }

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
      assent: assent.versions,
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
                {/* The shared field: show/hide, caps-lock hint, correct autofill token,
                    and paste never blocked. The rules render beneath it, ALWAYS — not as
                    a correction after a failure. */}
                <PasswordField
                  label={AUTH_COPY.reset.passwordLabel}
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  error={errors.password}
                />
                <PasswordRules assessment={policy} />
                <PasswordField
                  label={AUTH_COPY.reset.confirmLabel}
                  value={confirm}
                  onChange={setConfirm}
                  autoComplete="new-password"
                  error={errors.confirm}
                />
              </div>

              <div className="auth-assent">
                <p className="auth-assent__title">{ASSENT_COPY.sectionTitle}</p>
                <AssentSummary />
                <AssentCheckbox
                  checked={assent.accepted}
                  onChange={assent.setAccepted}
                  versions={assent.versions}
                  error={errors.assent ?? null}
                />
              </div>

              <Button
                variant="gold"
                size="md"
                onClick={submit}
                disabled={submitting || assent.recording}
              >
                {submitting || assent.recording ? PORTAL_COPY.invite.accepting : 'Create workspace'}
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
