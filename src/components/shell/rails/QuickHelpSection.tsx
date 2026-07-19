'use client';

import { RailPanel, RailText } from './_primitives';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/**
 * One tap to a person.
 *
 *   "A customer can always reach a named human without first negotiating with
 *    an agent."
 *
 * That is why this is a link to support and not a chat launcher.
 */
export function QuickHelpSection() {
  return (
    <RailPanel title="Need help now?">
      <RailText>{SUCCESS_COPY.team.reachability}</RailText>
      <a href="/workspace/success/support" className="text-caption text-ink-primary underline underline-offset-2">
        Reach your team
      </a>
    </RailPanel>
  );
}
