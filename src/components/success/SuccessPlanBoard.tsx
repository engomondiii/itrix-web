import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { SuccessPlan } from '@/types/success.types';

/**
 * The shared 30/60/90 plan.
 *
 * SHARED is the operative word: every milestone names an owner AND a side, and
 * the items that need something from the customer are pulled into their own
 * block. A plan that only lists what itriX will do is a status report; a plan
 * that surfaces the customer's dependencies early is what stops a deadline
 * becoming a surprise.
 */
export function SuccessPlanBoard({ plan }: { plan: SuccessPlan | null }) {
  if (!plan) return <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.plan.empty}</p>;

  const customerItems = plan.milestones.filter((m) => m.ownerSide === 'customer');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
          Next {plan.horizonDays} days
        </p>
        {plan.goals.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {plan.goals.map((g) => (
              <li key={g} className="text-web-body text-ink-primary">{g}</li>
            ))}
          </ul>
        ) : null}
        {plan.nextReviewAt ? (
          <p className="mt-3 text-caption text-ink-secondary">
            Next review {new Date(plan.nextReviewAt).toLocaleDateString()}
          </p>
        ) : null}
      </div>

      {customerItems.length > 0 ? (
        <section className="rounded-lg border border-border-medium bg-soft p-4">
          <h3 className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
            {SUCCESS_COPY.plan.dependencyTitle}
          </h3>
          <p className="mt-1.5 text-caption text-ink-secondary">{SUCCESS_COPY.plan.dependencyIntro}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {customerItems.map((m) => (
              <li key={m.id} className="text-caption text-ink-primary">
                {m.label}
                {m.dueAt ? <span className="text-ink-secondary"> · by {new Date(m.dueAt).toLocaleDateString()}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-label="All milestones">
        <ul className="flex flex-col gap-2">
          {plan.milestones.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border-soft bg-surface px-4 py-3"
            >
              <span className="text-web-body text-ink-primary">{m.label}</span>
              <span className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                <span className={m.status === 'blocked' ? 'text-error' : undefined}>
                  {m.status === 'complete' ? 'Complete'
                    : m.status === 'in_progress' ? 'In progress'
                    : m.status === 'blocked' ? 'Blocked' : 'Not started'}
                </span>
                <span className="text-ink-muted">
                  {m.ownerSide === 'customer' ? 'Your side' : 'itriX'}
                  {m.owner ? ` · ${m.owner}` : ''}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
