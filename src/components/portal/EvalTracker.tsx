'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { EvalStageLine } from './EvalStageLine';
import { EVALUATION_STAGE_ORDER } from '@/config/portal.config';
import { usePortalCopy } from '@/lib/i18n/portalLocale';
import type { AstopStage, EvaluationStage, PortalEvaluation } from '@/types/portal.types';
import { useLocaleStore } from '@/store/localeStore';

const ASTOP_ORDER = ['identify_qualify', 'nda_briefing', 'controlled_evaluation', 'lo_deployment', 'verify_expand'] as const;
const ASTOP_LABELS: Record<(typeof ASTOP_ORDER)[number], { en: string; ko: string }> = {
  identify_qualify: { en: 'Identify & Qualify', ko: '확인 및 적합성 검토' },
  nda_briefing: { en: 'NDA & Briefing', ko: 'NDA 및 브리핑' },
  controlled_evaluation: { en: 'Controlled Evaluation', ko: '통제된 평가' },
  lo_deployment: { en: 'License-Out & Deployment', ko: 'License-Out 및 배포' },
  verify_expand: { en: 'Verify & Expand', ko: '가치 검증 및 확장' },
};

function FeeStatus({ evaluation, ko }: { evaluation: PortalEvaluation; ko: boolean }) {
  const status = evaluation.customerFeeStatus ?? '';
  let text = ko
    ? 'ALPHA Compute 평가는 원칙적으로 유료입니다. 최종 비용 조건은 합의가 확정되면 이곳에 표시됩니다.'
    : 'An ALPHA Compute assessment is fee-bearing by default. Final fee treatment appears here when terms are finalized.';
  if (status === 'waived') text = ko ? '최종 조건에 따라 이번 ALPHA Compute 평가 비용은 면제되었습니다.' : 'Under the finalized terms, the fee for this ALPHA Compute assessment is waived.';
  if (status === 'partially_waived') text = ko ? '이번 ALPHA Compute 평가 비용은 최종 조건에 따라 조정되었습니다.' : 'The fee for this ALPHA Compute assessment has been adjusted under the finalized terms.';
  if (status === 'paid') {
    const amount = evaluation.finalAssessmentFee;
    text = amount !== null && amount !== undefined && amount !== ''
      ? (ko ? `최종 ALPHA Compute 평가 비용: ${amount}` : `Final ALPHA Compute assessment fee: ${amount}`)
      : (ko ? '최종 조건에 따라 ALPHA Compute 평가 비용이 적용됩니다.' : 'The ALPHA Compute assessment fee applies under the finalized terms.');
  }
  if (status === 'waiver_pending_finalization') text = ko ? '평가 비용 조건을 확정 중입니다. 확정 전에는 표시된 조건이 최종 조건이 아닙니다.' : 'Assessment fee treatment is being finalized. Any current treatment remains conditional until terms are finalized.';
  return <p className="text-secondary text-ink-secondary">{text}</p>;
}

function AstopTracker({ evaluation, ko }: { evaluation: PortalEvaluation; ko: boolean }) {
  const rawStage = (evaluation.astopStage || evaluation.stage || 'identify_qualify') as AstopStage;
  const stage = (ASTOP_ORDER as readonly string[]).includes(rawStage) ? rawStage as (typeof ASTOP_ORDER)[number] : 'identify_qualify';
  const currentIndex = ASTOP_ORDER.indexOf(stage);
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-structure-900">{ko ? 'ASTOP 진행 상황' : 'Your ASTOP journey'}</h2>
        <p className="reading text-ink-secondary">
          {ko ? 'ASTOP은 공개 다운로드나 셀프서비스 구매가 아니라, 적합성 확인부터 통제된 평가와 License-Out까지 단계별로 진행됩니다.' : 'ASTOP is a controlled progression from qualification through evaluation and License-Out, not a public download or self-service purchase.'}
        </p>
      </header>
      <Card variant="default" className="flex flex-col gap-4">
        <ul className="flex flex-col gap-3">
          {ASTOP_ORDER.map((item, i) => {
            const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
            const label = ASTOP_LABELS[item];
            return (
              <li key={item} className="flex items-start gap-3" aria-current={state === 'current' ? 'step' : undefined}>
                <span aria-hidden className={`mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-pill ${state === 'done' ? 'bg-tier-1' : state === 'current' ? 'bg-accent ring-2 ring-accent-soft/40' : 'bg-border-strong'}`} />
                <span className={`text-body ${state === 'upcoming' ? 'text-ink-secondary' : 'text-ink-primary'}`}>{ko ? label.ko : label.en}</span>
              </li>
            );
          })}
        </ul>
      </Card>
      <div className="rounded-md border border-border-soft bg-surface px-4 py-3">
        <SectionLabel withRule={false}>{ko ? '증거 우선' : 'Proof before progression'}</SectionLabel>
        <p className="mt-1 text-secondary text-ink-secondary">
          {ko ? '절감 수치만으로 다음 단계로 가지 않습니다. 의사결정 충실성, 보안·통합 가능성, 재현 가능한 가치가 먼저 확인되어야 합니다.' : 'Progression is not based on a savings headline alone. Decision fidelity, security/integration feasibility and reproducible value come first.'}
        </p>
        {evaluation.ttfvSeconds != null ? <p className="mt-2 text-caption text-ink-secondary">{ko ? '첫 검증 가치까지의 시간' : 'Time to First Verified Value'}: {Math.round(evaluation.ttfvSeconds / 60)} min</p> : null}
      </div>
    </div>
  );
}

/** Customer-safe tracking for either controlled ASTOP proof or ALPHA Compute assessment. */
export function EvalTracker({ evaluation }: { evaluation: PortalEvaluation }) {
  const portalCopy = usePortalCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  if (evaluation.kind === 'astop') return <AstopTracker evaluation={evaluation} ko={ko} />;

  const stage = (EVALUATION_STAGE_ORDER.includes(evaluation.stage as EvaluationStage) ? evaluation.stage : 'requested') as EvaluationStage;
  const currentIndex = EVALUATION_STAGE_ORDER.indexOf(stage);
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-structure-900">{ko ? 'ALPHA Compute 평가' : 'ALPHA Compute assessment'}</h2>
        <p className="reading text-ink-secondary">{portalCopy.evaluation.intro}</p>
      </header>
      <Card variant="default" className="flex flex-col gap-4">
        <ul className="flex flex-col gap-3">
          {EVALUATION_STAGE_ORDER.map((item, i) => (
            <EvalStageLine key={item} stage={item} state={i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming'} />
          ))}
        </ul>
        {stage === 'report_ready' && evaluation.reportHref ? (
          <div className="border-t border-border-soft pt-4"><Link href={evaluation.reportHref}><Button variant="primary" size="md">{portalCopy.evaluation.reportButton}</Button></Link></div>
        ) : null}
      </Card>
      <Card variant="warm" className="flex flex-col gap-2">
        <SectionLabel withRule={false}>{ko ? '평가 비용' : 'Assessment fee'}</SectionLabel>
        <FeeStatus evaluation={evaluation} ko={ko} />
      </Card>
      <div className="rounded-md border border-border-soft bg-surface px-4 py-3">
        <SectionLabel withRule={false}>{ko ? '평가에서 측정하는 항목' : 'What an assessment measures'}</SectionLabel>
        <p className="mt-1 text-secondary text-ink-secondary">{portalCopy.evaluation.measuresReminder}</p>
      </div>
    </div>
  );
}
