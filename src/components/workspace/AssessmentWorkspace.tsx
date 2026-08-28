'use client';

import { BoundaryWasteMapView } from './BoundaryWasteMapView';
import { useWorkspaceCopy } from '@/lib/i18n/successLocale';
import type { AssessmentPayload } from '@/types/workspace.types';
import { useLocaleStore } from '@/store/localeStore';

/**
 * The Alpha Compute Assessment workspace — State 7.
 *
 * Intake, baseline, Boundary Waste Map, feasibility, benchmark design, PoC
 * recommendation — in that order, because that is the order the work happens and
 * a customer reading top to bottom should be reading a narrative, not a dashboard.
 *
 * The standing promise sits at the top rather than the bottom: the customer
 * should always know what is happening, why it matters, and who owns the next
 * action. Putting it below the fold would make it decoration.
 */
export function AssessmentWorkspace({ data }: { data: AssessmentPayload }) {
  const ko = useLocaleStore((state) => state.locale) === 'ko';
  const workspaceCopy = useWorkspaceCopy();
  const { steps, nextMilestone } = data;

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="font-display text-web-h2 text-ink-primary">{workspaceCopy.assessment.title}</h1>
        <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{workspaceCopy.assessment.intro}</p>
        <p className="mt-3 max-w-reading text-web-body text-ink-primary">{workspaceCopy.assessment.standing}</p>
      </header>

      {nextMilestone ? (
        <section aria-label={ko ? '다음 마일스톤' : 'Next milestone'} className="rounded-lg border border-border-medium bg-soft p-4">
          <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">{ko ? '다음 마일스톤' : 'Next milestone'}</p>
          <p className="mt-1.5 text-web-body text-ink-primary">{nextMilestone.label}</p>
          <p className="mt-1 text-caption text-ink-secondary">
            {nextMilestone.owner ? (ko ? `${nextMilestone.owner} 담당` : `${nextMilestone.owner} owns it`) : (ko ? '담당자 지정 중' : 'Owner being assigned')}
            {nextMilestone.dueAt ? ` · due ${new Date(nextMilestone.dueAt).toLocaleDateString()}` : ''}
          </p>
        </section>
      ) : null}

      {/* The stage list. Status is a word; the marker only reinforces it. */}
      <section aria-labelledby="stages-title" className="flex flex-col gap-3">
        <h2 id="stages-title" className="font-display text-web-h3 text-ink-primary">{ko ? '현재 단계' : 'Where we are'}</h2>
        <ol className="flex flex-col gap-2">
          {steps.map((step) => (
            <li
              key={step.stage}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border-soft bg-surface px-4 py-3"
            >
              <span className="text-web-body text-ink-primary">{step.label}</span>
              <span className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                <span>
                  {step.status === 'complete' ? (ko ? '완료' : 'Complete') : step.status === 'in_progress' ? (ko ? '진행 중' : 'In progress') : (ko ? '시작 전' : 'Not started')}
                </span>
                {step.owner ? <span className="text-ink-muted">{step.owner}</span> : null}
              </span>
              {step.actionRequired ? (
                <p className="w-full text-caption text-warning">{ko ? '고객 조치 필요: ' : 'Needs you: '}{step.actionRequired}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {data.workloadSummary ? <Prose title={ko ? '검토한 워크로드' : 'The workload we took in'} body={data.workloadSummary} /> : null}
      {data.baselineSummary ? <Prose title={ko ? '합의한 기준선' : 'The baseline we agreed'} body={data.baselineSummary} /> : null}

      <BoundaryWasteMapView sections={data.boundaryWasteMap} />

      {data.feasibilityNotes ? <Prose title={ko ? '기술적 타당성' : 'Technical feasibility'} body={data.feasibilityNotes} /> : null}
      {data.benchmarkDesign ? <Prose title={ko ? '설계할 벤치마크' : 'The benchmark we would design'} body={data.benchmarkDesign} /> : null}
      {data.pocRecommendation ? <Prose title={ko ? '다음에 검증할 수 있는 것' : 'What we would recommend proving next'} body={data.pocRecommendation} /> : null}
    </div>
  );
}

function Prose({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-web-h3 text-ink-primary">{title}</h2>
      <p className="max-w-reading text-web-body leading-relaxed text-ink-secondary">{body}</p>
    </section>
  );
}
