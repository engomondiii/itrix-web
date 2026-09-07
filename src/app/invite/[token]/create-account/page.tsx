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
import { useAuthCopy } from '@/lib/i18n/authLocale';
import { useLegalErrorCopy } from '@/lib/i18n/legalErrorCopy';
import { ASSENT_COPY } from '@/lib/content/legalCopy';
import { JourneyProvider } from '@/context/JourneyContext';
import { RevealGate } from '@/components/client-page/RevealGate';
import { claimInvite } from '@/lib/api/inviteClaimApi';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { usePortalCopy } from '@/lib/i18n/portalLocale';
import { navigateAfterAuth } from '@/lib/navigation/afterAuth';
import { useLocaleStore } from '@/store/localeStore';

/** Invitation account creation. Assent versions travel in the same claim transaction. */
function CreateAccountInner({ token }: { token: string }) {
  const portalCopy = usePortalCopy();
  const authCopy = useAuthCopy();
  const legalErrorCopy = useLegalErrorCopy();
  const ko = useLocaleStore((state) => state.locale) === 'ko';
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

  const assent = useLegalAssent({ transport: 'in_payload' });
  const policy = usePasswordPolicy(password, confirm);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = ko ? '워크스페이스에서 사용할 이름을 입력해 주세요.' : 'Tell us who to address in the workspace.';
    if (!organization.trim()) next.organization = ko ? '회사 또는 조직을 입력해 주세요.' : 'Add your company or organization.';
    if (!/.+@.+\..+/.test(email.trim())) next.email = ko ? '올바른 이메일 주소를 입력해 주세요.' : 'Enter a valid email address.';
    if (policy.tooShort) next.password = authCopy.reset.tooShort;
    else if (!policy.matches) next.confirm = authCopy.reset.mismatch;
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!validate()) return;

    if (!assent.accepted) {
      setErrors((prev) => ({ ...prev, assent: prev.assent ?? ASSENT_COPY.blocked }));
      trackEvent('assent.blocked', {});
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.assent;
      return next;
    });

    const recorded = await assent.record(token);
    if (!recorded) {
      setErrors((prev) => ({ ...prev, assent: assent.error ?? ASSENT_COPY.blocked }));
      return;
    }

    if (!portalEnabled) {
      trackEvent('account.invite_fallback', { token, hasEmail: true });
      setFallback(true);
      return;
    }

    setSubmitting(true);
    const result = await claimInvite(token, {
      email: email.trim(),
      password,
      full_name: fullName.trim(),
      organization: organization.trim(),
      role: role.trim(),
      assent: assent.versions,
    });
    setSubmitting(false);

    if (result.kind === 'legal_terms_changed') {
      // The server changed from version N to N+1 after this form was rendered. Stay on
      // the form, invalidate the old checkmark, refetch authoritative publication metadata,
      // update the version labels, and require a new affirmative act before retrying.
      const refreshed = await assent.refreshVersions();
      setErrors((prev) => ({
        ...prev,
        assent: refreshed ? legalErrorCopy.termsChanged : legalErrorCopy.refreshFailed,
      }));
      trackEvent('assent.version_changed', { door: 'invite' });
      return;
    }

    if (result.kind === 'ok') {
      trackEvent('account.invite_claimed', { token, clientId: result.data.client.id });
      if (result.data.requiresPasswordSet) {
        router.push(routes.portalSetPassword);
      } else {
        navigateAfterAuth();
      }
      return;
    }

    trackEvent('account.invite_fallback', { token, reason: result.error ?? 'claim_failed' });
    setFallback(true);
  }

  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-lg">
        <RevealGate
          surface="account_invite"
          fallback={
            <Card variant="warm" className="flex flex-col gap-3 text-center">
              <SectionLabel>{ko ? '아직 이용할 수 없음' : 'Not yet available'}</SectionLabel>
              <h1 className="text-web-h3 text-structure-900">{ko ? '워크스페이스가 아직 열리지 않았습니다' : 'Your workspace isn’t open yet'}</h1>
              <p className="reading text-ink-secondary">{ko ? '팀이 현재 상황을 검토한 뒤 비공개 워크스페이스가 준비됩니다. 리뷰로 돌아가면 준비되는 즉시 해당 옵션이 표시됩니다.' : 'A private workspace becomes available once the team has reviewed your case. Return to your review — you’ll see the option there the moment it’s ready.'}</p>
              <div className="pt-1">
                <Link href={routes.clientPage}>
                  <Button variant="secondary">{ko ? '내 리뷰로 돌아가기' : 'Back to my review'}</Button>
                </Link>
              </div>
            </Card>
          }
        >
          {fallback ? (
            <Card variant="featured" className="flex flex-col gap-3 text-center">
              <SectionLabel tone="gold">{ko ? '감사합니다' : 'Thank you'}</SectionLabel>
              <h1 className="text-web-h3 text-structure-900">{portalCopy.invite.fallbackTitle}</h1>
              <p className="reading text-ink-secondary">{portalCopy.invite.fallbackBody}</p>
              <div className="pt-1">
                <Link href={routes.clientPage}>
                  <Button variant="secondary">{ko ? '내 리뷰로 돌아가기' : 'Back to my review'}</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card variant="featured" className="flex flex-col gap-4">
              <div>
                <SectionLabel tone="gold">{ko ? 'itriX 워크스페이스 만들기' : 'Create your itriX workspace'}</SectionLabel>
                <h1 className="mt-2 text-web-h3 text-structure-900">{ko ? '팀과 비공개로 계속하기' : 'Continue privately with the team'}</h1>
                <p className="reading mt-2 text-ink-secondary">{ko ? '이 대화를 보관하고, 필요한 보호와 권한이 갖춰진 범위에서 문서를 공유하며, itriX 팀과 다음 단계를 추적할 수 있는 비공개 워크스페이스를 설정하세요.' : 'Set up your private workspace to keep this conversation, share documents only when appropriate protection and authorization are in place, and track next steps with the itriX team.'}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Input
                  label={ko ? '이름' : 'Full name'}
                  value={fullName}
                  autoComplete="name"
                  placeholder={ko ? '이름' : 'Your name'}
                  error={errors.fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label={ko ? '회사 / 조직' : 'Company / organization'}
                  value={organization}
                  autoComplete="organization"
                  placeholder={ko ? '회사 또는 조직' : 'Your organization'}
                  error={errors.organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
                <Input
                  label={ko ? '역할(선택 사항)' : 'Role (optional)'}
                  value={role}
                  autoComplete="organization-title"
                  placeholder={ko ? '예: 인프라 책임자' : 'e.g. Head of Infrastructure'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Input
                  label={ko ? '이메일 주소' : 'Email address'}
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder="you@company.com"
                  error={errors.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordField
                  label={authCopy.reset.passwordLabel}
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  error={errors.password}
                />
                <PasswordRules assessment={policy} />
                <PasswordField
                  label={authCopy.reset.confirmLabel}
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
                {submitting || assent.recording ? portalCopy.invite.accepting : (ko ? '워크스페이스 만들기' : 'Create workspace')}
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
