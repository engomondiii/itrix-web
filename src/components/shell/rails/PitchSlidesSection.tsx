'use client';

import { RailPanel, RailText, RailEmpty } from './_primitives';
import { useJourneyContext } from '@/context/JourneyContext';

/**
 * Slide navigation for the pitch room (State 4).
 *
 * Phase 2 shows the reader where they are in their own brief. It never names the
 * pitch TYPE or the matched persona — those are internal classifications the
 * visitor must never see (Architecture v2.5 §4.2).
 */
export function PitchSlidesSection() {
  const { journeyNumber } = useJourneyContext();
  if ((journeyNumber ?? 0) < 4) return <RailEmpty />;

  return (
    <RailPanel title="Your brief">
      <RailText>The version of itriX that matters to your situation.</RailText>
      <a href="#pitch-room" className="text-caption text-ink-primary underline underline-offset-2">
        Jump to your brief
      </a>
    </RailPanel>
  );
}
