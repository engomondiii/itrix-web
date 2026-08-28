'use client';

import { useSuccessCopy } from '@/lib/i18n/successLocale';
import type { SuccessPlan } from '@/types/success.types';
import { useLocaleStore } from '@/store/localeStore';

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
  const successCopy = useSuccessCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  if (!plan) return <p className="text-web-body text-ink-secondary">{successCopy.plan.empty}</p>;

  const customerItems = plan.milestones.filter((m) => m.ownerSide === 'customer');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
          {ko ? `향후 ${plan.horizonDays}일` : `Next ${plan.horizonDays} days`}
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
            {ko ? '다음 리뷰' : 'Next review'} {new Date(plan.nextReviewAt).toLocaleDateString(ko ? 'ko-KR' : 'en')}
          </p>
        ) : null}
      </div>

      {customerItems.length > 0 ? (
        <section className="rounded-lg border border-border-medium bg-soft p-4">
          <h3 className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
            {successCopy.plan.dependencyTitle}
          </h3>
          <p className="mt-1.5 text-caption text-ink-secondary">{successCopy.plan.dependencyIntro}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {customerItems.map((m) => (
              <li key={m.id} className="text-caption text-ink-primary">
                {m.label}
                {m.dueAt ? <span className="text-ink-secondary">{ko ? ' · 기한 ' : ' · by '}{new Date(m.dueAt).toLocaleDateString(ko ? 'ko-KR' : 'en')}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-label={ko ? '전체 마일스톤' : 'All milestones'}>
        <ul className="flex flex-col gap-2">
          {plan.milestones.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border-soft bg-surface px-4 py-3"
            >
              <span className="text-web-body text-ink-primary">{m.label}</span>
              <span className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                <span className={m.status === 'blocked' ? 'text-error' : undefined}>
                  {m.status === 'complete' ? (ko ? '완료' : 'Complete')
                    : m.status === 'in_progress' ? (ko ? '진행 중' : 'In progress')
                    : m.status === 'blocked' ? (ko ? '차단됨' : 'Blocked') : (ko ? '시작 전' : 'Not started')}
                </span>
                <span className="text-ink-muted">
                  {m.ownerSide === 'customer' ? (ko ? '귀사' : 'Your side') : 'itriX'}
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
