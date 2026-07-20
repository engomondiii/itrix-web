'use client';

import { IntegrationReadiness } from '@/components/workspace/IntegrationReadiness';
import { DecisionLog } from '@/components/workspace/DecisionLog';
import type { Artifact } from '@/types/artifact.types';
import type { ReadinessItem, DecisionEntry } from '@/types/workspace.types';

/**
 * State 9 — integration and commercial decisions (Playbook v1.6, State 9).
 *
 *   "This holds integration readiness, the evidence both sides have accepted,
 *    the commercial decisions still open, the documents in flight, and the
 *    decision log."
 *
 * The decision log is the part that matters most and is easiest to skip: a
 * shared record of what was agreed and by whom. At this stage both sides are
 * making commitments that outlive the people in the room, so the log renders
 * inside the artifact rather than living somewhere a customer has to ask for.
 *
 * Pricing, terms and exclusivity are never rendered here. They are not public,
 * not agent-emittable, and not part of this payload (Architecture v2.6 §19.5).
 */
interface IntegrationPayload {
  intro?: string;
  readiness?: ReadinessItem[];
  decisions?: DecisionEntry[];
}

export function IntegrationReadinessArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as IntegrationPayload;
  const readiness = p.readiness ?? [];
  const decisions = p.decisions ?? [];

  return (
    <div className="artifact__body">
      {p.intro ? <p className="artifact__lead">{p.intro}</p> : null}

      {readiness.length > 0 ? (
        <section>
          <h3 className="artifact__section-title">Integration readiness</h3>
          <IntegrationReadiness items={readiness} />
        </section>
      ) : null}

      {decisions.length > 0 ? (
        <section>
          <h3 className="artifact__section-title">Decision log</h3>
          <DecisionLog entries={decisions} />
        </section>
      ) : null}
    </div>
  );
}
