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
  const cta = getGovernedCta(state.nextBestAction, locale);
  const basis = state.valueBasis ? labelBasis(state.valueBasis, copy) : null;

  return (
    <section aria-labelledby="astop-success-title" className="rounded-panel border border-border-soft bg-surface-glass-soft p-5">
      <div className="flex flex-col gap-1">
        <h2 id="astop-success-title" className="font-display text-web-h3 text-ink-primary">{copy.title}</h2>
        <p className="max-w-reading text-caption text-ink-secondary">{copy.intro}</p>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2" aria-live="polite">
        <Fact label={copy.labels.progression} value={displayState(state.progressionState, locale, copy.unavailable)} />
        <Fact label={copy.labels.ttfv} value={formatTtfv(state.ttfvSeconds, locale, copy)} />
        <Fact label={copy.labels.value} value={state.verifiedValueSummary ?? copy.unavailable} />
        <Fact label={copy.labels.basis} value={basis ?? copy.unavailable} />
        <Fact label={copy.labels.deployment} value={state.deploymentScopeSummary ?? copy.unavailable} />
        <Fact label={copy.labels.readiness} value={displayState(state.readinessState, locale, copy.unavailable)} />
        <Fact label={copy.labels.lo} value={displayState(state.loStatus, locale, copy.unavailable)} />
        <Fact label={copy.labels.licensedScope} value={state.licensedScopeSummary ?? copy.unavailable} />
        <Fact label={copy.labels.entitlement} value={displayState(state.entitlementState, locale, copy.unavailable)} />
        <Fact label={copy.labels.entitlementExpiry} value={formatDate(state.entitlementExpiry, locale, copy.unavailable)} />
        <Fact label={copy.labels.support} value={displayState(state.supportState, locale, copy.unavailable)} />
        <Fact label={copy.labels.expansion} value={displayState(state.expansionState, locale, copy.unavailable)} />
      </dl>

      {state.alphaAssessment ? (
        <div className="mt-6 border-t border-border-soft pt-5">
          <h3 className="text-web-body font-semibold text-ink-primary">{copy.sections.assessment}</h3>
          <dl className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Fact label={copy.labels.eligibility} value={displayState(state.alphaAssessment.eligibility, locale, copy.unavailable)} />
            <Fact label={copy.labels.assessment} value={displayState(state.alphaAssessment.assessmentState, locale, copy.unavailable)} />
            <Fact label={copy.labels.fee} value={displayState(state.alphaAssessment.feeState, locale, copy.unavailable)} />
            <Fact label={copy.labels.waiver} value={displayState(state.alphaAssessment.waiverState, locale, copy.unavailable)} />
            <Fact label={copy.labels.assessmentEntitlement} value={displayState(state.alphaAssessment.entitlementState, locale, copy.unavailable)} />
          </dl>
        </div>
      ) : null}

      {state.alphaCoreOpportunity ? (
        <div className="mt-6 border-t border-border-soft pt-5">
          <h3 className="text-web-body font-semibold text-ink-primary">{copy.sections.alphaCore}</h3>
          <p className="mt-2 text-caption text-ink-secondary">
            {displayState(state.alphaCoreState, locale, copy.unavailable)}
          </p>
        </div>
      ) : null}

      {(state.nextRequiredAction || state.nextBestAction) ? (
        <div className="mt-6 border-t border-border-soft pt-5" data-testid="governed-next-action">
          <p className="text-caption font-semibold text-ink-primary">{copy.labels.nextAction}</p>
          <p className="mt-1 text-web-body text-ink-secondary">
            {state.nextRequiredAction ?? displayState(state.nextBestAction, locale, copy.actionRequired)}
          </p>
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
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function labelBasis(value: string, copy: typeof ASTOP_SUCCESS_COPY.en | typeof ASTOP_SUCCESS_COPY.ko): string {
  const key = canonicalState(value);
  if (key === 'measured') return copy.measured;
  if (key === 'estimated') return copy.estimated;
  if (key === 'mixed' || key === 'measured_and_estimated') return copy.mixed;
  return displayState(value, copy === ASTOP_SUCCESS_COPY.ko ? 'ko' : 'en', copy.unavailable);
}

function canonicalState(value: string): string {
  return value.trim().replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
}

function displayState(value: string | null, locale: 'en' | 'ko', unavailable: string): string {
  if (!value) return unavailable;
  const key = canonicalState(value);
  const en: Record<string, string> = {
    preparation: 'Preparation in progress', preparing: 'Preparation in progress', negotiation: 'LO negotiation', lo_preparation: 'LO preparation',
    lo_negotiation: 'LO negotiation', executed: 'Executed', lo_executed: 'LO executed', pending: 'Pending', active: 'Active', expired: 'Expired',
    revoked: 'Revoked', deployment_readiness_pending: 'Deployment readiness pending', deployment_ready: 'Deployment ready', blocked: 'Blocked — action required',
    action_required: 'Action required', measured: 'Measured', estimated: 'Estimated', eligible: 'Eligible', ineligible: 'Not eligible', unassessed: 'Not yet assessed',
    open: 'Open', in_progress: 'In progress', waiting_on_customer: 'Waiting on you', resolved: 'Resolved', none: 'None', not_applicable: 'Not applicable',
  };
  const ko: Record<string, string> = {
    preparation: '준비 진행 중', preparing: '준비 진행 중', negotiation: 'LO 협의 중', lo_preparation: 'LO 준비 중', lo_negotiation: 'LO 협의 중',
    executed: '체결 완료', lo_executed: 'LO 체결 완료', pending: '대기 중', active: '활성', expired: '만료', revoked: '취소됨',
    deployment_readiness_pending: '배포 준비 대기', deployment_ready: '배포 준비 완료', blocked: '차단됨 — 조치 필요', action_required: '조치 필요',
    measured: '측정값', estimated: '추정값', eligible: '적격', ineligible: '부적격', unassessed: '아직 평가되지 않음',
    open: '열림', in_progress: '진행 중', waiting_on_customer: '고객 응답 대기', resolved: '해결됨', none: '없음', not_applicable: '해당 없음',
  };
  const mapped = (locale === 'ko' ? ko : en)[key];
  if (mapped) return mapped;
  return locale === 'ko' ? value : key.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}
