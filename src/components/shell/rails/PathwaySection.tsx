'use client';

import { RailPanel, RailText } from './_primitives';
import { useJourneyContext } from '@/context/JourneyContext';
import { journeyNumber as numberFor } from '@/lib/journey/journeyStates';

const STEP_LABEL: Record<number, string> = {
  1: 'You have arrived',
  2: 'We are listening',
  3: 'We have reflected it back',
  4: 'Your brief is ready',
  5: 'A pathway is recommended',
  6: 'Confidential review',
};

/**
 * "Your pathway" — where things stand, in the visitor's terms.
 *
 * It states the STAGE of the relationship, never a score, a tier or a
 * probability. The visitor should be able to read this and feel oriented, not
 * measured.
 */
export function PathwaySection() {
  const { state } = useJourneyContext();
  const n = numberFor(state) ?? 1;
  const label = STEP_LABEL[Math.min(n, 6)] ?? STEP_LABEL[1];

  return (
    <RailPanel title="Your pathway">
      <RailText>{label}</RailText>
      <RailText>Nothing moves forward unless you choose it.</RailText>
    </RailPanel>
  );
}
