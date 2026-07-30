'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthFooterLinks } from '@/components/auth/AuthFooterLinks';
import { AuthErrorSummary } from '@/components/auth/AuthErrorSummary';
import { RateLimitNotice } from '@/components/auth/RateLimitNotice';
import { InviteCodeField } from '@/components/auth/InviteCodeField';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { AssentCheckbox } from '@/components/legal/AssentCheckbox';
import { AssentSummary } from '@/components/legal/AssentSummary';
import { useSignUp } from '@/hooks/useSignUp';
import { usePasswordPolicy } from '@/hooks/usePasswordPolicy';
import { useLegalAssent } from '@/hooks/useLegalAssent';
import { AUTH_COPY } from '@/lib/content/authCopy';
import { ASSENT_COPY } from '@/lib/content/legalCopy';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * SIGN UP — two doors, and by default only one of them is a form.
 *
 * ── THE DECISION BEHIND THIS PAGE ───────────────────────────────────────────
 * Accounts on this platform are EARNED. A visitor describes a problem, the platform
 * listens, a personalized brief is delivered, and only then is an invite minted
 * (State 5). A public form that opened a workspace on demand would produce Clients with
 * no Lead, no journey state and no disclosure basis — breaking value-first (R4),
 * qualification (R2) and the persona-keyed pitch model (R3).
 *
 * Architecture v2.8 §00.2 records all four consequences and flags the decision for
 * sign-off. Until it is taken, `ENABLE_OPEN_SIGNUP` is off and this page does two honest
 * things instead:
 *
 *   DOOR 1  "I have an invitation" — the case the missing sign-up link was ACTUALLY
 *           blocking: someone who was invited, closed the email, and typed the site name
 *           into a browser. The code resolves to the existing capability URL and hands
 *           off to /c/[token]/create-account, which takes assent.
 *
 *   DOOR 2  "I don't have one yet" — NOT A FORM. It says a workspace opens after a short
 *           conversation and links to the arrival composer, because the front door
 *           already IS the sign-up flow here. A form that collected an email and
 *           answered "we'll be in touch" would be a worse experience AND would create
 *           accounts with no journey behind them.
 *
 * ── DOOR 1 HANDS OFF RATHER THAN DUPLICATING ────────────────────────────────
 * The account-creation flow already collects the details, takes assent, records it
 * BEFORE the claim, and mints the JWT. Rebuilding that here would create a second
 * account-creation path, and therefore a second place for the assent gate to be
 * forgotten.
 */
export default function SignUpPage() {
  /* `register` is deliberately NOT taken here: the open-registration form owns its own
     `useSignUp()` so that its submitting state is separate from door 1's code check.
     Pulling both through one instance would make the code button spin while the
     registration form was posting. */
  const { redeem, openSignupEnabled, submitting, error, retryAfterSeconds, clearError } = useSignUp();
  const [code, setCode] = useState('');

  return (
    <AuthPanel>
      <AuthHeading title={AUTH_COPY.signUp.title} standfirst={AUTH_COPY.signUp.standfirst} />

      <AuthErrorSummary messages={[error]} />
      <RateLimitNotice retryAfterSeconds={retryAfterSeconds} />

      {/* ── DOOR 1 ────────────────────────────────────────────────────────── */}
      <section className="auth-door" aria-labelledby="door-invite">
        <h2 id="door-invite" className="auth-door__label">
          {AUTH_COPY.signUp.doorOneLabel}
        </h2>

        <InviteCodeField
          value={code}
          onChange={(v) => {
            setCode(v);
            if (error) clearError();
          }}
          onSubmitKey={() => void redeem(code)}
        />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => void redeem(code)}
          disabled={submitting || code.trim().length === 0}
        >
          {submitting ? AUTH_COPY.signUp.codeChecking : AUTH_COPY.signUp.codeSubmit}
        </Button>
      </section>

      <div className="auth-divider" role="separator" />

      {/* ── DOOR 2 ────────────────────────────────────────────────────────── */}
      {openSignupEnabled ? <OpenRegistration /> : <ConversationDoor />}

      <AuthFooterLinks
        links={[
          {
            prefix: AUTH_COPY.signUp.haveAccountPrefix,
            label: AUTH_COPY.signUp.haveAccountLink,
            href: routes.portalSignIn,
          },
        ]}
      />
    </AuthPanel>
  );
}

/**
 * Door 2, by default. NOT A FORM.
 *
 * It collects nothing and promises nothing it cannot keep. The link goes to the arrival
 * composer, which is where a workspace actually starts.
 */
function ConversationDoor() {
  return (
    <section className="auth-door" aria-labelledby="door-conversation">
      <h2 id="door-conversation" className="auth-door__label">
        {AUTH_COPY.signUp.doorTwoLabel}
      </h2>
      <p className="auth-door__body">{AUTH_COPY.signUp.doorTwoBody}</p>
      <Link
        href={routes.home}
        className="auth-door__action"
        onClick={() => trackEvent('auth.signup_door_chosen', { door: 'conversation' })}
      >
        {AUTH_COPY.signUp.doorTwoAction}
      </Link>
    </section>
  );
}

/**
 * Door 2, with `ENABLE_OPEN_SIGNUP` on. Off by default — see the page note.
 *
 * ── IT MOUNTS THE SAME ASSENT CHECKBOX AS THE INVITE FLOW (R44) ─────────────
 * Assent is taken on EVERY path that creates a Client (Architecture v2.8 §19.10), and
 * there is no second version of the checkbox: the same component, the same instrument
 * versions, recorded before the account exists. A Client that exists without an assent
 * record is the state that rule is there to prevent, whichever door it came through.
 */
function OpenRegistration() {
  const { register, submitting } = useSignUp();
  const assent = useLegalAssent();

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const policy = usePasswordPolicy(password, confirm);

  async function submit() {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Tell us who to address in the workspace.';
    if (!organization.trim()) next.organization = 'Add your company or organization.';
    if (!/.+@.+\..+/.test(email.trim())) next.email = 'Enter a valid work email.';
    if (policy.tooShort) next.password = AUTH_COPY.reset.tooShort;
    else if (!policy.matches) next.confirm = AUTH_COPY.reset.mismatch;
    if (!assent.accepted) next.assent = ASSENT_COPY.blocked;

    setErrors(next);
    if (Object.keys(next).length > 0) {
      if (next.assent) trackEvent('assent.blocked', {});
      return;
    }

    /* Recorded BEFORE the account is created, so a Client never exists without it. A
       failure stops here and says so — it is not swallowed. */
    const recorded = await assent.record();
    if (!recorded) {
      setErrors({ assent: assent.error ?? ASSENT_COPY.blocked });
      return;
    }

    await register({
      email,
      password,
      fullName,
      organization,
      role,
      assentVersions: assent.versions,
    });
  }

  return (
    <section className="auth-door" aria-labelledby="door-open">
      <h2 id="door-open" className="auth-door__label">
        {AUTH_COPY.signUp.openTitle}
      </h2>

      <div className="auth-fields">
        <Input label={AUTH_COPY.signUp.nameLabel} value={fullName} autoComplete="name" error={errors.fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label={AUTH_COPY.signUp.organizationLabel} value={organization} autoComplete="organization" error={errors.organization} onChange={(e) => setOrganization(e.target.value)} />
        <Input label={AUTH_COPY.signUp.roleLabel} value={role} autoComplete="organization-title" onChange={(e) => setRole(e.target.value)} />
        <Input label={AUTH_COPY.signUp.emailLabel} type="email" value={email} autoComplete="username" error={errors.email} onChange={(e) => setEmail(e.target.value)} />

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

      <Button variant="primary" size="lg" fullWidth onClick={() => void submit()} disabled={submitting || assent.recording}>
        {submitting || assent.recording ? AUTH_COPY.signUp.openSubmitting : AUTH_COPY.signUp.openSubmit}
      </Button>
    </section>
  );
}
