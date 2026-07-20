'use client';

import { OutcomeProgressCard } from '@/components/success/OutcomeProgressCard';
import { DeploymentHealthPanel } from '@/components/success/DeploymentHealthPanel';
import { SuccessPlanBoard } from '@/components/success/SuccessPlanBoard';
import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { Artifact } from '@/types/artifact.types';
import type {
  Outcome, DeploymentHealth, SuccessPlan, ChangeEntry,
} from '@/types/success.types';

/**
 * State 10 — where things stand (Playbook v1.6 §12A–12F).
 *
 * PINNED TO THE TOP OF THE THREAD and regenerated on material change
 * (Architecture v2.6 §17.3). A returning customer should see their outcomes,
 * their deployment health and what changed before they scroll anywhere.
 *
 * THE PRIORITY RULE governs what is and is not in here:
 *
 *   "Keeping paying customers happy and successful is more important than moving
 *    them toward another agreement. This is not an upsell surface."
 *
 * So this artifact carries outcomes, health, changes and the shared plan — and
 * carries NO commercial content at all. Expansion, when it is earned, arrives as
 * a separate next-best-action card the backend decides to send.
 *
 * What a customer must never see here (Playbook §12J): licence-out probability,
 * deal score, tier, account priority, persona label, churn-risk modelling,
 * negotiation posture, or any internal classification of who they are. None of
 * it is in the client-plane payload, so there is nothing to filter.
 */
interface SuccessOverviewPayload {
  outcomes?: Outcome[];
  deployments?: DeploymentHealth[];
  changesSince?: ChangeEntry[];
  plan?: SuccessPlan | null;
}

export function SuccessOverviewArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as SuccessOverviewPayload;
  const outcomes = p.outcomes ?? [];
  const deployments = p.deployments ?? [];
  const changes = p.changesSince ?? [];

  return (
    <div className="artifact__body">
      {outcomes.length > 0 ? (
        <section>
          <h3 className="artifact__section-title">{SUCCESS_COPY.outcomes.title}</h3>
          <p className="artifact__lead">{SUCCESS_COPY.outcomes.intro}</p>
          <div className="artifact__outcomes">
            {outcomes.map((o) => (
              <OutcomeProgressCard key={o.id} outcome={o} />
            ))}
          </div>
        </section>
      ) : null}

      {deployments.length > 0 ? (
        <section>
          <h3 className="artifact__section-title">{SUCCESS_COPY.deployments.title}</h3>
          <DeploymentHealthPanel deployments={deployments} />
        </section>
      ) : null}

      <section>
        <h3 className="artifact__section-title">{SUCCESS_COPY.changes.title}</h3>
        {changes.length > 0 ? (
          <ul className="artifact__list">
            {changes.map((c) => (
              <li key={c.id}>{c.summary}</li>
            ))}
          </ul>
        ) : (
          /* An honest empty state. Nothing changed is information, not a gap. */
          <p>{SUCCESS_COPY.changes.empty}</p>
        )}
      </section>

      {p.plan ? (
        <section>
          <h3 className="artifact__section-title">{SUCCESS_COPY.plan.title}</h3>
          <SuccessPlanBoard plan={p.plan} />
        </section>
      ) : null}
    </div>
  );
}
