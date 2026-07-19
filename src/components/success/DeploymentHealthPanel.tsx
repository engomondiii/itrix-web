import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { DeploymentHealth } from '@/types/success.types';

/**
 * Deployment health — operational status, last check, incidents, versions and
 * the limitations we already know about.
 *
 * The known-limitations block is the point of this panel. Stating a limitation
 * before a customer discovers it is what makes the rest of the page believable;
 * a health panel that only ever says "stable" is a health panel nobody reads.
 */
const TONE: Record<DeploymentHealth['status'], string> = {
  stable: 'text-success',
  degraded: 'text-warning',
  incident: 'text-error',
  unknown: 'text-ink-secondary',
};

export function DeploymentHealthPanel({ deployments }: { deployments: readonly DeploymentHealth[] }) {
  if (deployments.length === 0) {
    return <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.deployments.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {deployments.map((d) => (
        <article key={d.environment} className="rounded-lg border border-border-soft bg-surface p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-card-title text-ink-primary">{d.environment}</h3>
            <span className={`font-mono text-micro uppercase tracking-[0.08em] ${TONE[d.status]}`}>
              {SUCCESS_COPY.deployments.status[d.status]}
            </span>
          </div>

          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-caption text-ink-secondary">
            {d.version ? (
              <div className="flex gap-1.5">
                <dt className="text-ink-muted">Version</dt>
                <dd className="font-mono">{d.version}</dd>
              </div>
            ) : null}
            <div className="flex gap-1.5">
              <dt className="text-ink-muted">Incidents, 30 days</dt>
              <dd className="tabular-nums">{d.incidents30d}</dd>
            </div>
            {d.lastCheckedAt ? (
              <div className="flex gap-1.5">
                <dt className="text-ink-muted">Last checked</dt>
                <dd>{new Date(d.lastCheckedAt).toLocaleString()}</dd>
              </div>
            ) : null}
          </dl>

          {d.knownLimitations.length > 0 ? (
            <div className="mt-3 rounded-md border border-border-soft bg-soft p-3">
              <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                {SUCCESS_COPY.deployments.limitationsTitle}
              </p>
              <p className="mt-1.5 text-caption text-ink-secondary">{SUCCESS_COPY.deployments.limitationsIntro}</p>
              <ul className="mt-2 flex flex-col gap-1">
                {d.knownLimitations.map((l) => (
                  <li key={l} className="text-caption text-ink-secondary">{l}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
