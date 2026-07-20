'use client';

import { PoCEvidenceTable } from '@/components/workspace/PoCEvidenceTable';
import type { Artifact } from '@/types/artifact.types';
import type { PoCKpi } from '@/types/workspace.types';

/**
 * State 8 — proving it on the customer's workload (Playbook v1.6, State 8).
 *
 * THE LANGUAGE RULE FOR RESULTS, quoted because it is the reason this component
 * is deliberately plain:
 *
 *   "A negative or partial result is reported as a negative or partial result.
 *    It is never re-described after the fact as a partial success, a learning,
 *    or a promising signal. The credibility of every future claim depends on
 *    this one."
 *
 * `KpiOutcome` is a closed union of exactly four values — pass, partial,
 * negative, pending. There is no "promising", no "trending positive", no
 * "directionally correct". A softened outcome is not a wording choice this
 * component can make, because the vocabulary does not contain one.
 *
 * The baseline and the agreed KPIs render alongside the results, so a reader
 * can see what was promised next to what happened.
 */
interface PoCEvidencePayload {
  intro?: string;
  baseline?: string;
  kpis?: PoCKpi[];
}

export function PoCEvidenceArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as PoCEvidencePayload;
  const kpis = p.kpis ?? [];

  return (
    <div className="artifact__body">
      {p.intro ? <p className="artifact__lead">{p.intro}</p> : null}

      {p.baseline ? (
        <section>
          <h3 className="artifact__section-title">The baseline we agreed</h3>
          <p>{p.baseline}</p>
        </section>
      ) : null}

      {kpis.length > 0 ? (
        <section>
          <h3 className="artifact__section-title">Results against the agreed KPIs</h3>
          <PoCEvidenceTable kpis={kpis} />
        </section>
      ) : (
        <p className="artifact__pending">
          Evidence appears here as it is produced.
        </p>
      )}
    </div>
  );
}
