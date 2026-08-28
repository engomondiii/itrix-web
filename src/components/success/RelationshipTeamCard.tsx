'use client';

import { useSuccessCopy } from '@/lib/i18n/successLocale';
import type { RelationshipTeamMember, TeamRole } from '@/types/success.types';
import { useLocaleStore } from '@/store/localeStore';

const ROLE_ORDER: TeamRole[] = ['customer_success', 'technical', 'executive', 'support'];

/**
 * The named humans who own this relationship.
 *
 *   "A customer can always reach a named human without first negotiating with
 *    an agent."  — Architecture v2.5 §7.3
 *
 * Every member is shown with what they handle, so the customer never has to
 * guess who to ask. That sentence about reachability is rendered as a promise on
 * the page, not left as an internal principle.
 */
export function RelationshipTeamCard({ team }: { team: readonly RelationshipTeamMember[] }) {
  const ko = useLocaleStore((state) => state.locale) === 'ko';
  const successCopy = useSuccessCopy();
  if (team.length === 0) return <p className="text-web-body text-ink-secondary">{successCopy.team.empty}</p>;

  const ordered = [...team].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || Number(b.isPrimary) - Number(a.isPrimary),
  );

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {ordered.map((m) => (
          <li key={m.id} className="rounded-lg border border-border-soft bg-surface p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-card-title text-ink-primary">
                {m.name}
                {m.isPrimary ? <span className="ml-2 font-mono text-micro uppercase tracking-[0.08em] text-ink-muted">{ko ? '주 담당' : 'Primary'}</span> : null}
              </h3>
              <span className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                {successCopy.team.roleLabel[m.role]}
              </span>
            </div>
            <p className="mt-1.5 text-caption text-ink-secondary">
              {m.expectations || successCopy.team.roles[m.role]}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-caption text-ink-primary">{successCopy.team.reachability}</p>
    </div>
  );
}
