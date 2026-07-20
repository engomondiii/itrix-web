'use client';

import type { Artifact } from '@/types/artifact.types';

/**
 * State 4 — the personalized brief (Playbook v1.6, State 4).
 *
 *   "Based on what you shared, here is the version of itriX that matters to you."
 *
 * PERSONALIZATION WITHOUT PROFILING (Architecture v2.6 §4). The framing, the
 * emphasis and the chosen pathway are tailored. It NEVER tells the visitor what
 * we think we know about them: no persona name, no department, no tier, no
 * score. The most tailored brief and the safest brief must be the same brief.
 *
 * Slides render in order and each is governed independently on the backend. A
 * slide that did not clear governance is absent from the payload — this
 * component has nothing to hide and nothing to filter.
 */
interface Slide {
  id: string;
  title: string;
  body?: string;
  bullets?: string[];
}

interface PitchRoomPayload {
  intro?: string;
  slides?: Slide[];
}

export function PitchRoomArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as PitchRoomPayload;
  const slides = p.slides ?? [];

  return (
    <div className="artifact__body">
      {p.intro ? <p className="artifact__lead">{p.intro}</p> : null}

      <ol className="artifact__slides">
        {slides.map((slide, i) => (
          <li key={slide.id} className="artifact__slide">
            <span aria-hidden="true" className="artifact__slide-index">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="artifact__section-title">{slide.title}</h3>
              {slide.body ? <p>{slide.body}</p> : null}
              {slide.bullets && slide.bullets.length > 0 ? (
                <ul className="artifact__list">
                  {slide.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
