'use client';

import { useReviewStore } from '@/store/reviewStore';
import { RailPanel, RailText, RailEmpty } from './_primitives';

/**
 * "What we heard" — the visitor's own words, restated.
 *
 * This is the first thing the left rail ever shows, and it sets the rail's
 * character: relationship MEMORY, not a file on the person. It shows what they
 * told us and nothing we inferred — no company, no department, no persona, no
 * tier, no score (Surface 1 v4.0 §3.2 rule 1).
 */
export function HeardSection() {
  const prompt = useReviewStore((s) => s.prompt);
  const pressures = useReviewStore((s) => s.selectedPressures);

  if (!prompt.trim()) return <RailEmpty />;

  return (
    <RailPanel title="What we heard">
      <RailText>{prompt.trim()}</RailText>
      {pressures.length > 0 ? (
        <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-muted">
          {pressures.join(' · ')}
        </p>
      ) : null}
    </RailPanel>
  );
}
