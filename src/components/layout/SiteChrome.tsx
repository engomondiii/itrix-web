'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ConversationShell } from '@/components/shell/ConversationShell';
import { useArrivalMode } from '@/hooks/useArrivalMode';
import { siteConfig } from '@/config/site.config';

/**
 * Decides the chrome for each route — and is the ONLY component that mounts the
 * conversation shell.
 *
 * That last part is a hard rule, not a preference. When two components could
 * each mount a shell, the surface rendered two sidebars: submitting rewrites the
 * URL to /review/<id> via history.replaceState, usePathname reacts, this
 * component stopped treating the route as chromeless and mounted a shell — while
 * the landing page, still rendered because replaceState does not change the
 * route segment, mounted a second one inside it.
 *
 * Three cases, in order:
 *
 *   1. SELF-CHROMED segments render bare. The (portal) group has its own
 *      PortalShell; the auth screens deliberately have no chrome at all.
 *   2. THE ARRIVAL SCREEN renders bare. On `/`, before the visitor has spoken,
 *      the approved landing is a complete page with its own header, rails and
 *      footer. A sidebar beside it is not in the approved design.
 *   3. EVERYTHING ELSE gets the conversation shell.
 *
 * Case 2 is keyed on `/` specifically rather than on any conversation route:
 * /review/<id> always means a thread is intended, so it keeps the shell even
 * while its transcript is still loading. Otherwise a visitor opening a thread
 * link would see the landing flash before their conversation appeared.
 */
const SELF_CHROMED_PREFIXES = ['/workspace', '/sign-in', '/set-password', '/forgot-password'];

function isSelfChromed(pathname: string): boolean {
  return SELF_CHROMED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const arrival = useArrivalMode();

  if (isSelfChromed(pathname)) return <>{children}</>;

  /* The approved arrival screen owns the whole page. */
  if (pathname === '/' && arrival) return <>{children}</>;

  if (!siteConfig.featureFlags.conversationSurface) return <main id="content">{children}</main>;

  return <ConversationShell>{children}</ConversationShell>;
}
