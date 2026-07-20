'use client';

import type { Artifact } from '@/types/artifact.types';

/**
 * State 5 — the Compute Bottleneck Review Summary.
 *
 * It is one of the three artifacts that can satisfy the VALUE-FIRST gate: a
 * commitment ask is structurally unreachable until a problem mirror, a
 * personalized brief, or this summary has been delivered
 * (Architecture v2.6 §5).
 *
 * Like the reflection, it carries NO performance figures. The review is free and
 * pre-assessment; there is nothing measured yet, and a qualitative summary that
 * cannot render a number cannot accidentally imply one.
 */
interface ReviewSummaryPayload {
  intro?: string;
  whatWeHeard?: string[];
  whatWeWouldExamine?: string[];
  recommendedNext?: string;
}

export function ReviewSummaryArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as ReviewSummaryPayload;

  return (
    <div className="artifact__body">
      {p.intro ? <p className="artifact__lead">{p.intro}</p> : null}

      {p.whatWeHeard && p.whatWeHeard.length > 0 ? (
        <section>
          <h3 className="artifact__section-title">What we heard</h3>
          <ul className="artifact__list">
            {p.whatWeHeard.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </section>
      ) : null}

      {p.whatWeWouldExamine && p.whatWeWouldExamine.length > 0 ? (
        <section>
          <h3 className="artifact__section-title">What we would examine</h3>
          <ul className="artifact__list">
            {p.whatWeWouldExamine.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </section>
      ) : null}

      {p.recommendedNext ? (
        <section>
          <h3 className="artifact__section-title">Where we would go next</h3>
          <p>{p.recommendedNext}</p>
        </section>
      ) : null}
    </div>
  );
}
