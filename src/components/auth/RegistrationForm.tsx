'use client';

import { useEffect, useState } from 'react';
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
import { legalApi } from '@/lib/api/legalApi';
import { trackEvent } from '@/lib/analytics/trackEvent';

/** Open registration. Qualification/routing remain conversation-owned; this form only creates identity. */
export function RegistrationForm() {
  const authCopy = useAuthCopy();
  const { register, submitting, error, retryAfterSeconds, legalTermsChanged } = useSignUp();
  const assent = useLegalAssent({ transport: 'in_payload' });

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const policy = usePasswordPolicy(password, confirm);

  useEffect(() => {
    if (!legalTermsChanged) return;
    // A stale assent can never be re-used. Refetch the backend publication metadata and
    // force a fresh unticked decision before another submission is possible.
    assent.setAccepted(false);
    void legalApi.instruments();
  }, [legalTermsChanged, assent.setAccepted]);

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
        <Input label={authCopy.signUp.nameLabel} value={fullName} autoComplete="name" error={errors.fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label={authCopy.signUp.organizationLabel} value={organization} autoComplete="organization" error={errors.organization} onChange={(e) => setOrganization(e.target.value)} />
        <Input label={authCopy.signUp.roleLabel} value={role} autoComplete="organization-title" onChange={(e) => setRole(e.target.value)} />
        <Input label={authCopy.signUp.emailLabel} type="email" value={email} autoComplete="username" error={errors.email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordField label={authCopy.signUp.passwordLabel} value={password} onChange={setPassword} autoComplete="new-password" error={errors.password} />
        <PasswordRules assessment={policy} />
        <PasswordField label={authCopy.signUp.confirmLabel} value={confirm} onChange={setConfirm} autoComplete="new-password" error={errors.confirm} onSubmitKey={() => void submit()} />
      </div>

      <div className="auth-assent">
        <p className="auth-assent__title">{ASSENT_COPY.sectionTitle}</p>
        <AssentSummary />
        <AssentCheckbox checked={assent.accepted} onChange={assent.setAccepted} versions={assent.versions} error={errors.assent ?? null} />
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={() => void submit()} disabled={submitting}>
        {submitting ? authCopy.signUp.submitting : authCopy.signUp.submit}
      </Button>
    </div>
  );
}
