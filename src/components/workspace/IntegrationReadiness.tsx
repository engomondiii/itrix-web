import { WORKSPACE_COPY } from '@/lib/content/successCopy';
import type { ReadinessItem } from '@/types/workspace.types';

/**
 * Integration readiness — State 9.
 *
 * Every row states its status in words and names an owner. A blocked item with
 * no owner is how integration stalls for a month, so the owner column is never
 * optional in practice even though the type permits null.
 */
export function IntegrationReadiness({ items }: { items: readonly ReadinessItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="readiness-title" className="flex flex-col gap-3">
      <h2 id="readiness-title" className="font-display text-web-h3 text-ink-primary">
        {WORKSPACE_COPY.integration.readinessTitle}
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border-soft bg-surface px-4 py-3"
          >
            <span className="text-web-body text-ink-primary">{item.label}</span>
            <span className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.08em]">
              <span className={item.status === 'blocked' ? 'text-error' : 'text-ink-secondary'}>
                {WORKSPACE_COPY.integration.readinessStatus[item.status]}
              </span>
              {item.owner ? <span className="text-ink-muted">{item.owner}</span> : null}
            </span>
            {item.note ? <p className="w-full text-caption text-ink-secondary">{item.note}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
