'use client';

import { ArrivalLanding } from './ArrivalLanding';
import { ConversationShell } from '@/components/shell/ConversationShell';
import { ConversationColumn } from '@/components/shell/ConversationColumn';
import { useArrivalMode } from '@/hooks/useArrivalMode';

/**
 * The switch between the two surfaces.
 *
 * It lives here rather than in SiteChrome for one reason: SiteChrome wraps EVERY
 * route, and only the landing has an arrival state. Putting the branch in the
 * shared chrome would mean every marketing page carried a condition that is
 * false for it.
 *
 * The empty state passed to ConversationColumn is never actually rendered —
 * `useArrivalMode` is exactly the condition ConversationColumn uses to decide
 * emptiness, so by the time we render the shell there is at least one turn. It
 * is supplied as a defensive fallback rather than left null, because a column
 * with no empty state and a race on the store would render a blank screen.
 */
export function LandingSurface() {
  const arrival = useArrivalMode();

  if (arrival) return <ArrivalLanding />;

  return (
    <ConversationShell>
      <ConversationColumn emptyState={<ArrivalLanding />} />
    </ConversationShell>
  );
}
