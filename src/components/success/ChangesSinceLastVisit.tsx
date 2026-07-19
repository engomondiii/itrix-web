'use client';

import { SUCCESS_COPY } from '@/lib/content/successCopy';
import { useChangesSince } from '@/hooks/useChangesSince';
import type { ChangeKind } from '@/types/success.types';

/**
 * "What changed since you were last here."
 *
 * Work completed, issues resolved, updates shipped, and anything waiting on a
 * decision from the customer — decisions first, because those are the only items
 * that cost the customer something if they scroll past.
 */
const ORDER: Record<ChangeKind, number> = {
  decision_needed: 0,
  issue_resolved: 1,
  work_completed: 2,
  update: 3,
};

export function ChangesSinceLastVisit() {
  const { changes, loading, acknowledge } = useChangesSince();

  if (loading) return null;
  if (changes.length === 0) {
    return <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.changes.empty}</p>;
  }

  const ordered = [...changes].sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {ordered.map((c) => (
          <li key={c.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-border-soft bg-surface px-4 py-3">
            <span
              className={`font-mono text-micro uppercase tracking-[0.08em] ${
                c.kind === 'decision_needed' ? 'text-warning' : 'text-ink-secondary'
              }`}
            >
              {SUCCESS_COPY.changes.kind[c.kind]}
            </span>
            <span className="text-web-body text-ink-primary">{c.summary}</span>
            <span className="text-caption text-ink-muted">{new Date(c.occurredAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={acknowledge} className="button-text self-start text-caption">
        Mark as read
      </button>
    </div>
  );
}
