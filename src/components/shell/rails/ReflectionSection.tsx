'use client';

import { useReviewStore } from '@/store/reviewStore';
import { RailPanel, RailText, RailEmpty } from './_primitives';

/**
 * The saved reflection (State 3).
 *
 * The reflection itself lives in the centre; the rail keeps its shape so the
 * visitor can see what has been established without scrolling back. It shows
 * only what the backend already delivered as a value artifact — never an
 * inferred persona, tier or score.
 *
 * `recognizedPressures` is the visitor's OWN language echoed back, which is why
 * it is safe to show here: it is memory, not classification.
 */
export function ReflectionSection() {
  const immediate = useReviewStore((s) => s.immediateResponse);
  if (!immediate) return <RailEmpty />;

  return (
    <RailPanel title="Your reflection">
      <RailText>{immediate.acknowledgement}</RailText>
      {immediate.recognizedPressures.length > 0 ? (
        <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-muted">
          {immediate.recognizedPressures.join(' · ')}
        </p>
      ) : null}
    </RailPanel>
  );
}
