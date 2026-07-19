import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { Outcome, OutcomeStatus } from '@/types/success.types';

/**
 * Progress against ONE agreed customer outcome.
 *
 * "Progress against agreed customer outcomes — not internal sales targets."
 *
 * Status is one of exactly four words. It is never softened: an outcome that is
 * off plan says Off plan, on the customer's own screen, before they have to ask.
 * Colour reinforces the word; it never carries it alone.
 */
const TONE: Record<OutcomeStatus, string> = {
  on_plan: 'text-success',
  at_risk: 'text-warning',
  off_plan: 'text-error',
  achieved: 'text-success',
};

export function OutcomeProgressCard({ outcome }: { outcome: Outcome }) {
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border-soft bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-card-title text-ink-primary">{outcome.title}</h3>
        <span className={`font-mono text-micro uppercase tracking-[0.08em] ${TONE[outcome.status]}`}>
          {SUCCESS_COPY.outcomes.status[outcome.status]}
        </span>
      </div>

      {outcome.description ? (
        <p className="max-w-reading text-caption leading-relaxed text-ink-secondary">{outcome.description}</p>
      ) : null}

      {outcome.metric ? (
        <dl className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-caption text-ink-secondary">
          <div className="flex gap-1.5">
            <dt className="text-ink-muted">Measuring</dt>
            <dd className="tabular-nums">{outcome.metric}</dd>
          </div>
          {outcome.baseline ? (
            <div className="flex gap-1.5">
              <dt className="text-ink-muted">Baseline</dt>
              <dd className="tabular-nums">{outcome.baseline}</dd>
            </div>
          ) : null}
          {outcome.current ? (
            <div className="flex gap-1.5">
              <dt className="text-ink-muted">Now</dt>
              <dd className="tabular-nums">{outcome.current}</dd>
            </div>
          ) : null}
          {outcome.target ? (
            <div className="flex gap-1.5">
              <dt className="text-ink-muted">Target</dt>
              <dd className="tabular-nums">{outcome.target}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {outcome.owner || outcome.dueAt ? (
        <p className="text-caption text-ink-secondary">
          {outcome.owner ? `${outcome.owner} owns this` : 'Owner being assigned'}
          {outcome.dueAt ? ` · by ${new Date(outcome.dueAt).toLocaleDateString()}` : ''}
        </p>
      ) : null}
    </article>
  );
}
