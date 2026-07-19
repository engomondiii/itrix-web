import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { RelationshipTeamMember, TeamRole } from '@/types/success.types';

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
  if (team.length === 0) return <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.team.empty}</p>;

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
                {m.isPrimary ? <span className="ml-2 font-mono text-micro uppercase tracking-[0.08em] text-ink-muted">Primary</span> : null}
              </h3>
              <span className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                {SUCCESS_COPY.team.roleLabel[m.role]}
              </span>
            </div>
            <p className="mt-1.5 text-caption text-ink-secondary">
              {m.expectations || SUCCESS_COPY.team.roles[m.role]}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-caption text-ink-primary">{SUCCESS_COPY.team.reachability}</p>
    </div>
  );
}
