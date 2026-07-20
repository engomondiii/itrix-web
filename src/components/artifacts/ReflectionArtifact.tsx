'use client';

import type { Artifact } from '@/types/artifact.types';

/**
 * State 3 — the personalized reflection (Playbook v1.6, State 3).
 *
 *   "Here is how we would describe your bottleneck, the layer we think it may
 *    really sit in, and the ALPHA route that would be worth examining first."
 *
 * TWO HARD RULES, and they are why this component has no numeric fields:
 *
 *   · NO PERFORMANCE FIGURES. A reflection precedes any assessment or PoC, so
 *     there is nothing measured to report. Making a number un-renderable here
 *     means a claim cannot leak through a payload change.
 *   · IT IS A HYPOTHESIS, NOT AN ASSERTION. The language is "may", "would be
 *     worth examining" — and it never names an inferred company, department or
 *     persona (Architecture v2.6 §4).
 */
interface ReflectionPayload {
  acknowledgement?: string;
  recognizedPressures?: string[];
  likelyBoundary?: string;
  suggestedRoute?: string;
}

export function ReflectionArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as ReflectionPayload;

  return (
    <div className="artifact__body">
      {p.acknowledgement ? <p className="artifact__lead">{p.acknowledgement}</p> : null}

      {p.recognizedPressures && p.recognizedPressures.length > 0 ? (
        <section>
          <h3 className="artifact__section-title">What we heard</h3>
          <ul className="artifact__list">
            {p.recognizedPressures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {p.likelyBoundary ? (
        <section>
          <h3 className="artifact__section-title">Where the constraint may actually sit</h3>
          <p>{p.likelyBoundary}</p>
        </section>
      ) : null}

      {p.suggestedRoute ? (
        <section>
          <h3 className="artifact__section-title">What would be worth examining first</h3>
          <p>{p.suggestedRoute}</p>
        </section>
      ) : null}
    </div>
  );
}
