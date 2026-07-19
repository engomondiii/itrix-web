import { BoundaryWasteMapView } from './BoundaryWasteMapView';
import { WORKSPACE_COPY } from '@/lib/content/successCopy';
import type { AssessmentPayload } from '@/types/workspace.types';

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
  const { steps, nextMilestone } = data;

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="font-display text-web-h2 text-ink-primary">{WORKSPACE_COPY.assessment.title}</h1>
        <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{WORKSPACE_COPY.assessment.intro}</p>
        <p className="mt-3 max-w-reading text-web-body text-ink-primary">{WORKSPACE_COPY.assessment.standing}</p>
      </header>

      {nextMilestone ? (
        <section aria-label="Next milestone" className="rounded-lg border border-border-medium bg-soft p-4">
          <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">Next milestone</p>
          <p className="mt-1.5 text-web-body text-ink-primary">{nextMilestone.label}</p>
          <p className="mt-1 text-caption text-ink-secondary">
            {nextMilestone.owner ? `${nextMilestone.owner} owns it` : 'Owner being assigned'}
            {nextMilestone.dueAt ? ` · due ${new Date(nextMilestone.dueAt).toLocaleDateString()}` : ''}
          </p>
        </section>
      ) : null}

      {/* The stage list. Status is a word; the marker only reinforces it. */}
      <section aria-labelledby="stages-title" className="flex flex-col gap-3">
        <h2 id="stages-title" className="font-display text-web-h3 text-ink-primary">Where we are</h2>
        <ol className="flex flex-col gap-2">
          {steps.map((step) => (
            <li
              key={step.stage}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border-soft bg-surface px-4 py-3"
            >
              <span className="text-web-body text-ink-primary">{step.label}</span>
              <span className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                <span>
                  {step.status === 'complete' ? 'Complete' : step.status === 'in_progress' ? 'In progress' : 'Not started'}
                </span>
                {step.owner ? <span className="text-ink-muted">{step.owner}</span> : null}
              </span>
              {step.actionRequired ? (
                <p className="w-full text-caption text-warning">Needs you: {step.actionRequired}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {data.workloadSummary ? <Prose title="The workload we took in" body={data.workloadSummary} /> : null}
      {data.baselineSummary ? <Prose title="The baseline we agreed" body={data.baselineSummary} /> : null}

      <BoundaryWasteMapView sections={data.boundaryWasteMap} />

      {data.feasibilityNotes ? <Prose title="Technical feasibility" body={data.feasibilityNotes} /> : null}
      {data.benchmarkDesign ? <Prose title="The benchmark we would design" body={data.benchmarkDesign} /> : null}
      {data.pocRecommendation ? <Prose title="What we would recommend proving next" body={data.pocRecommendation} /> : null}
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
