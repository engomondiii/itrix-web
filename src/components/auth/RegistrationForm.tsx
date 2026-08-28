'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { AuthErrorSummary } from '@/components/auth/AuthErrorSummary';
import { RateLimitNotice } from '@/components/auth/RateLimitNotice';
import { AssentCheckbox } from '@/components/legal/AssentCheckbox';
import { AssentSummary } from '@/components/legal/AssentSummary';
import { useSignUp } from '@/hooks/useSignUp';
import { isValidEmail } from '@/lib/validation/emailValidator';
import { usePasswordPolicy } from '@/hooks/usePasswordPolicy';
import { useLegalAssent } from '@/hooks/useLegalAssent';
import { useAuthCopy } from '@/lib/i18n/authLocale';
import { ASSENT_COPY } from '@/lib/content/legalCopy';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * OPEN REGISTRATION (Architecture v2.9 §27.2, Surface 1 v8.0 §16.7, R60).
 *
 * ── WHAT CHANGED, AND WHY IT IS SAFE ────────────────────────────────────────
 * v2.8 rested on EARNED ACCOUNTS: a Client always arrived attached to a Lead, a journey
 * state and a disclosure basis, and open registration was flagged off with four
 * consequences recorded against it. The decision has been taken the other way, and three
 * of those four consequences do not survive contact with the code:
 *
 *   the ceiling      is min(plane cap, state ceiling), and State 1 is `public`. A person
 *                    who registers on arrival and says nothing reaches EXACTLY what an
 *                    anonymous visitor reaches (R59)
 *   qualification    Layer 1 runs on the conversation. This form scores nothing and
 *                    routes nothing
 *   the pitch model  a persona is inferred from what somebody SAID. Silence keys to
 *                    nothing, so no pitch room renders
 *
 * What was left was the real risk — anybody can register anybody's work address — and
 * that is answered by verification (R66) and by one-account-per-address (R63), both of
 * which live on the backend.
 *
 * ── NOTHING HERE IS PREFILLED (R69) ─────────────────────────────────────────
 * Not organisation from the email domain, not name from anything, not role from a
 * persona. `Lead.persona`, tier and score are on the §10.5 internal-only list, and a
 * form that helpfully filled in a recognised company would be that list surfacing
 * through an input.
 *
 * ── ASSENT TRAVELS IN THE PAYLOAD, NOT IN A PRIOR REQUEST (R62) ─────────────
 * `useLegalAssent({ transport: 'in_payload' })`. The versions are collected here and sent
 * WITH the credentials, and the backend writes the record inside the transaction that
 * creates the Client.
 *
 * This is not a convenience. `/api/legal/assent` proxies to `portal/legal/assent/`, which
 * authenticates on the CLIENT plane — before registration there is no client-JWT and no
 * Client for a record to attach to. The record-then-create sequence the v7.0 component
 * used could not work on this path at all.
 */
export function RegistrationForm() {
  const authCopy = useAuthCopy();
  const { register, submitting, error, retryAfterSeconds } = useSignUp();
  const assent = useLegalAssent({ transport: 'in_payload' });

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const policy = usePasswordPolicy(password, confirm);

  /**
   * Local validation is parity with the backend's, deliberately.
   *
   * The register proxy collapses every non-rate-limited backend outcome into one
   * response so the browser cannot learn whether the address was already in use
   * (R64). That collapse is only safe if everything the backend would reject for a
   * fixable reason has already been caught HERE — required fields, address shape,
   * length, match, assent. Keep the two in step.
   *
   * ── ANY DOMAIN. THERE IS NO WORK-EMAIL RULE, AND THERE NEVER WAS ──────────
   * The backend serializer is a plain `EmailField()` and `register_client()` performs no
   * domain check, so a personal address has always been accepted. The label said "Work
   * email" and the error said "Enter your work email", which read as a restriction that
   * did not exist — both are now domain-neutral (Playbook v1.9 SS18C needs the same edit
   * so the copy source and the build do not drift).
   *
   * The shape check uses the shared `isValidEmail` rather than an inline regex. The
   * inline `/.+@.+\..+/` accepted `a b@c.d` — spaces and all — which DRF's EmailField
   * then rejects with a 400 that the proxy collapses into the same 202 as success. That
   * is a visitor told to check their email for a message nobody sent. Sharing the
   * validator is what keeps the two ends of the parity contract from drifting apart.
   */
  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = authCopy.signUp.missingName;
    if (!organization.trim()) next.organization = authCopy.signUp.missingOrganization;
    if (!isValidEmail(email)) next.email = authCopy.signUp.missingEmail;
    if (policy.tooShort) next.password = authCopy.reset.tooShort;
    else if (!policy.matches) next.confirm = authCopy.reset.mismatch;
    if (!assent.accepted) next.assent = ASSENT_COPY.blocked;
    return next;
  }

  async function submit() {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      if (next.assent) trackEvent('assent.blocked', {});
      return;
    }

    await register({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      organization: organization.trim(),
      role: role.trim() || undefined,
      assentVersions: assent.versions,
    });
  }

  return (
    <div className="auth-register">
      <AuthErrorSummary messages={[error, ...Object.values(errors)]} />
      <RateLimitNotice retryAfterSeconds={retryAfterSeconds} />

      <div className="auth-fields">
        <Input
          label={authCopy.signUp.nameLabel}
          value={fullName}
          autoComplete="name"
          error={errors.fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label={authCopy.signUp.organizationLabel}
          value={organization}
          autoComplete="organization"
          error={errors.organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
        <Input
          label={authCopy.signUp.roleLabel}
          value={role}
          autoComplete="organization-title"
          onChange={(e) => setRole(e.target.value)}
        />
        <Input
          label={authCopy.signUp.emailLabel}
          type="email"
          value={email}
          autoComplete="username"
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          label={authCopy.signUp.passwordLabel}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          error={errors.password}
        />
        {/* Shown ALWAYS, not only after a failure (Playbook v1.9 §18C). */}
        <PasswordRules assessment={policy} />
        <PasswordField
          label={authCopy.signUp.confirmLabel}
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          error={errors.confirm}
          onSubmitKey={() => void submit()}
        />
      </div>

      {/* R44 — the SAME unticked, versioned checkbox the invite flow mounts. There is no
          second version of it, because a second version is a second place for the gate to
          be forgotten (Architecture v2.9 §19.10). */}
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
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => void submit()}
        disabled={submitting}
      >
        {submitting ? authCopy.signUp.submitting : authCopy.signUp.submit}
      </Button>
    </div>
  );
}
