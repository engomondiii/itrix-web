'use client';

import { ArrivalLanding } from './ArrivalLanding';
import { ArrivalCenter } from './ArrivalCenter';
import { ConversationColumn } from '@/components/shell/ConversationColumn';
import { useArrivalMode } from '@/hooks/useArrivalMode';

/**
 * The switch between the two surfaces.
 *
 * EXACTLY ONE COMPONENT MOUNTS THE CONVERSATION SHELL, and it is SiteChrome.
 *
 * This used to mount its own, which produced two sidebars: submitting rewrites
 * the URL to /review/<id> with history.replaceState, Next's usePathname reacts
 * to that, SiteChrome stopped treating the route as chromeless and mounted a
 * shell — while this component, still the rendered page because replaceState
 * does not change the route segment, mounted a second one inside it.
 *
 * The rule that prevents it recurring: a component may render EITHER the shell
 * OR its contents, never both. SiteChrome owns the shell; everything below it
 * renders contents only.
 *
 * The fallback passed to ConversationColumn is the bare CENTRE, not the full
 * arrival screen — if it ever renders it will be inside the shell, and a second
 * header and footer in there would be the same class of mistake.
 */
export function LandingSurface() {
  const arrival = useArrivalMode();

  if (arrival) return <ArrivalLanding />;

  return <ConversationColumn emptyState={<ArrivalCenter />} />;
}
