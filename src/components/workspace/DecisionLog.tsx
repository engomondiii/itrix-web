import { WORKSPACE_COPY } from '@/lib/content/successCopy';
import type { DecisionEntry } from '@/types/workspace.types';

/**
 * The shared decision log — State 9.
 *
 * A record of what BOTH sides decided and when. Decisions awaiting the customer
 * are marked in words, not by colour, and are listed first so nothing waiting on
 * them is buried under history.
 */
export function DecisionLog({
  entries,
  title = WORKSPACE_COPY.integration.logTitle,
}: {
  entries: readonly DecisionEntry[];
  title?: string;
}) {
  if (entries.length === 0) return null;

  const ordered = [...entries].sort((a, b) => Number(b.awaitingCustomer) - Number(a.awaitingCustomer));

  return (
    <section aria-labelledby="decision-log-title" className="flex flex-col gap-3">
      <h2 id="decision-log-title" className="font-display text-web-h3 text-ink-primary">{title}</h2>
      <ul className="flex flex-col gap-2">
        {ordered.map((d) => (
          <li key={d.id} className="rounded-lg border border-border-soft bg-surface p-4">
            <p className="text-web-body text-ink-primary">{d.summary}</p>
            <p className="mt-1.5 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
              {d.decidedBy} · {new Date(d.decidedAt).toLocaleDateString()}
              {d.awaitingCustomer ? <span className="ml-2 text-warning">Awaiting your decision</span> : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
