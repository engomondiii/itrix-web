'use client';

import { RailPanel, RailText } from './_primitives';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/**
 * The private pulse, offered from the rail.
 *
 * The rail OFFERS it; it does not embed the form. A satisfaction question that
 * follows a customer around every screen stops reading as an invitation and
 * starts reading as nagging.
 */
export function SatisfactionPulseSection() {
  return (
    <RailPanel title={SUCCESS_COPY.feedback.title}>
      <RailText>{SUCCESS_COPY.feedback.prompt}</RailText>
      <a href="/workspace/success/feedback" className="text-caption text-ink-primary underline underline-offset-2">
        Tell us
      </a>
    </RailPanel>
  );
}
