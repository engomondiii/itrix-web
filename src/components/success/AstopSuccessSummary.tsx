'use client';

import Link from 'next/link';
import { Spinner } from '@/components/ui/Spinner';
import { ASTOP_SUCCESS_COPY } from '@/lib/content/astopSuccessCopy';
import { normalizeAstopSuccessProjection } from '@/lib/portal/astopSuccess';
import { getGovernedCta } from '@/lib/portal/governedNextAction';
import { useLocaleStore } from '@/store/localeStore';
import type { AstopSuccessProjection } from '@/types/astop-success.types';

export function AstopSuccessSummary({ data, loading }: { data: AstopSuccessProjection | null; loading: boolean }) {
  const locale = useLocaleStore((s) => s.locale) === 'ko' ? 'ko' : 'en';
  const copy = ASTOP_SUCCESS_COPY[locale];

  if (loading) {
    return <div className="flex justify-center py-6" aria-label={copy.title}><Spinner size="sm" /></div>;
  }
  if (!data) return null;

  const state = normalizeAstopSuccessProjection(data);
  if (!state.exists) return null;

  const effectiveAction = state.nextRequiredAction ?? state.nextBestAction;
  const cta = getGovernedCta(effectiveAction, locale);
  const basis = state.valueBasis ? labelBasis(state.valueBasis, copy) : null;
  const verifiedValue = state.verifiedValueSummary ?? displayState(state.verifiedValueStatus, locale, copy.unavailable);

  return (
    <section aria-labelledby="astop-success-title" className="rounded-panel border border-border-soft bg-surface-glass-soft p-5">
      <div className="flex flex-col gap-1">
        <h2 id="astop-success-title" className="font-display text-web-h3 text-ink-primary">{copy.title}</h2>
        <p className="max-w-reading text-caption text-ink-secondary">{copy.intro}</p>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2" aria-live="polite" aria-atomic="false">
        <Fact label={copy.labels.astopStage} value={displayState(state.astopStage, locale, copy.unavailable)} />
        <Fact label={copy.labels.progression} value={displayState(state.progressionState, locale, copy.unavailable)} />
        <Fact label={copy.labels.ttfv} value={formatTtfv(state.ttfvSeconds, locale, copy)} />
        <Fact label={copy.labels.value} value={verifiedValue} />
        <Fact label={copy.labels.basis} value={basis ?? copy.unavailable} />
        <Fact label={copy.labels.deployment} value={state.deploymentScopeSummary ?? copy.unavailable} />
        <Fact label={copy.labels.lo} value={displayState(state.loStatus, locale, copy.unavailable)} />
        <Fact label={copy.labels.entitlement} value={displayState(state.entitlementState, locale, copy.unavailable)} />
        <Fact label={copy.labels.entitlementExpiry} value={formatDate(state.entitlementExpiry, locale, copy.unavailable)} />
        <Fact label={copy.labels.support} value={displayState(state.supportState, locale, copy.unavailable)} />
        <Fact label={copy.labels.expansion} value={displayState(state.expansionState, locale, copy.unavailable)} />
      </dl>

      {effectiveAction ? (
        <div className="mt-6 border-t border-border-soft pt-5" data-testid="governed-next-action">
          <p className="text-caption font-semibold text-ink-primary">{copy.labels.nextAction}</p>
          <p className="mt-1 text-web-body text-ink-secondary">{cta?.label ?? copy.actionRequired}</p>
          {cta ? (
            <Link
              href={cta.href}
              className="mt-3 inline-flex min-h-11 items-center rounded-control border border-border-strong px-4 text-web-body font-medium text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              data-governed-action={cta.key}
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption text-ink-tertiary">{label}</dt>
      <dd className="mt-1 break-words text-web-body text-ink-primary">{value}</dd>
    </div>
  );
}

function formatTtfv(seconds: number | null, locale: 'en' | 'ko', copy: typeof ASTOP_SUCCESS_COPY.en | typeof ASTOP_SUCCESS_COPY.ko): string {
  if (seconds === null) return copy.unavailable;
  if (seconds < 60) return locale === 'ko' ? `${seconds}${copy.seconds}` : `${seconds} ${copy.seconds}`;
  if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return locale === 'ko' ? `${minutes}${copy.minutes}` : `${minutes} ${copy.minutes}`;
  }
  const hours = Math.round((seconds / 3600) * 10) / 10;
  return locale === 'ko' ? `${hours}${copy.hours}` : `${hours} ${copy.hours}`;
}

function formatDate(value: string | null, locale: 'en' | 'ko', unavailable: string): string {
  if (!value) return unavailable;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable;
  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function labelBasis(value: string, copy: typeof ASTOP_SUCCESS_COPY.en | typeof ASTOP_SUCCESS_COPY.ko): string {
  const key = canonicalState(value);
  if (key === 'measured') return copy.measured;
  if (key === 'estimated') return copy.estimated;
  if (key === 'mixed' || key === 'measured_and_estimated') return copy.mixed;
  return copy.unavailable;
}

function canonicalState(value: string): string {
  return value.trim().replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
}

function displayState(value: string | null, locale: 'en' | 'ko', unavailable: string): string {
  if (!value) return unavailable;
  const key = canonicalState(value);
  const en: Record<string, string> = {
    identify_qualify: 'Identify & qualify', nda_briefing: 'NDA & briefing', controlled_evaluation: 'Controlled evaluation',
    lo_deployment: 'License-Out & deployment', verify_expand: 'Verify & expand', closed: 'Closed',
    discovery: 'Discovery', sales_platform: 'AI-Powered Sales Platform', astop: 'ASTOP', alpha_compute: 'ALPHA Compute', alpha_core: 'ALPHA Core',
    not_started: 'Not started', negotiating: 'In negotiation', executed: 'Executed',
    pending: 'Pending', active: 'Active', expired: 'Expired', revoked: 'Revoked', revoking: 'Revocation in progress',
    suspended: 'Suspended', blocked: 'Blocked — action required', unknown: 'Status unavailable',
    blocking: 'Blocking support issue open', open: 'Support issue open', none: 'No open support issue', resolved: 'Resolved',
    not_recorded: 'Not recorded', planned: 'Planned', in_progress: 'In progress', active_expansion: 'Active', completed: 'Completed',
    verified: 'Verified', not_verified: 'Not yet verified', measured: 'Measured', estimated: 'Estimated', unavailable: 'Unavailable',
  };
  const ko: Record<string, string> = {
    identify_qualify: '확인 및 적합성 검토', nda_briefing: 'NDA 및 브리핑', controlled_evaluation: '통제된 평가',
    lo_deployment: 'License-Out 및 배포', verify_expand: '가치 검증 및 확장', closed: '종료',
    discovery: '탐색', sales_platform: 'AI-Powered Sales Platform', astop: 'ASTOP', alpha_compute: 'ALPHA Compute', alpha_core: 'ALPHA Core',
    not_started: '시작 전', negotiating: '협의 중', executed: '체결 완료',
    pending: '대기 중', active: '활성', expired: '만료', revoked: '취소됨', revoking: '취소 처리 중',
    suspended: '일시 중지', blocked: '차단됨 — 조치 필요', unknown: '상태 확인 불가',
    blocking: '차단 중인 지원 이슈 있음', open: '지원 이슈 있음', none: '열린 지원 이슈 없음', resolved: '해결됨',
    not_recorded: '기록 없음', planned: '계획됨', in_progress: '진행 중', active_expansion: '진행 중', completed: '완료',
    verified: '검증 완료', not_verified: '아직 검증되지 않음', measured: '측정값', estimated: '추정값', unavailable: '확인 불가',
  };
  return (locale === 'ko' ? ko : en)[key] ?? unavailable;
}
