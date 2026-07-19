import { KpiOutcomeBadge } from './KpiOutcomeBadge';
import { WORKSPACE_COPY } from '@/lib/content/successCopy';
import type { PoCKpi } from '@/types/workspace.types';

/**
 * The PoC evidence table — State 8.
 *
 * The agreed criterion is rendered BESIDE every result, always. That single
 * layout decision is what makes reinterpretation impossible: a reader can see
 * what was promised and what happened in the same row, so a result cannot be
 * quietly recast in the surrounding prose.
 *
 * Rendered as a real table with scoped headers, so the relationship between a
 * KPI and its outcome survives a screen reader.
 */
export function PoCEvidenceTable({ kpis }: { kpis: readonly PoCKpi[] }) {
  if (kpis.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Agreed KPIs, the criteria set before the run, and the observed outcomes.
        </caption>
        <thead>
          <tr className="border-b border-border-medium">
            <th scope="col" className="py-2 pr-4 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">KPI</th>
            <th scope="col" className="py-2 pr-4 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">{WORKSPACE_COPY.poc.criterionLabel}</th>
            <th scope="col" className="py-2 pr-4 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">Baseline</th>
            <th scope="col" className="py-2 pr-4 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">Observed</th>
            <th scope="col" className="py-2 font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">Outcome</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((k) => (
            <tr key={k.id} className="border-b border-border-soft align-top">
              <th scope="row" className="py-3 pr-4 text-caption font-semibold text-ink-primary">
                {k.label}
              </th>
              <td className="py-3 pr-4 text-caption text-ink-secondary">
                {k.passCriterion}
                {k.partialCriterion ? (
                  <span className="mt-1 block text-ink-muted">Partial: {k.partialCriterion}</span>
                ) : null}
              </td>
              <td className="py-3 pr-4 text-caption tabular-nums text-ink-secondary">{k.baseline ?? '—'}</td>
              <td className="py-3 pr-4 text-caption tabular-nums text-ink-secondary">{k.observed ?? '—'}</td>
              <td className="py-3">
                <KpiOutcomeBadge outcome={k.outcome} />
                {k.notes ? <p className="mt-1.5 max-w-[32ch] text-caption text-ink-secondary">{k.notes}</p> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
