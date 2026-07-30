'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ArrivalShell } from './ArrivalShell';
import { WorkingShell } from './WorkingShell';
import { useShellContext } from '@/context/ShellContext';
import { useArrivalMode } from '@/hooks/useArrivalMode';
import { siteConfig } from '@/config/site.config';
import { LEGAL_INSTRUMENTS } from '@/lib/content/legalCopy';

/**
 * THE SHELL MODE GATE — and the only component that mounts a shell.
 *
 * REPLACES layout/SiteChrome.tsx, and inherits the hard rule that file earned:
 * exactly one component may mount a shell. When two could, the surface rendered
 * two rails — submitting rewrites the URL to /review/<id> with
 * history.replaceState, usePathname reacts, the chrome component stopped treating
 * the route as chromeless and mounted a shell, while the landing page, still
 * rendered because replaceState does not change the route segment, mounted a
 * second one inside it. A component may render EITHER a shell OR its contents.
 * This one renders shells; everything below it renders contents.
 *
 * ── FOUR CASES, IN ORDER ────────────────────────────────────────────────────
 *
 *   1. SELF-CHROMED segments render bare. The (portal) group has its own
 *      PortalShell and the auth screens deliberately have no chrome at all.
 *   2. THE LEGAL ROUTES render bare. Each is a static document that must be
 *      readable without JavaScript and printable, and neither is true of a page
 *      nested inside a client-side shell.
 *   3. ARRIVAL renders the arrival shell around the centre.
 *   4. EVERYTHING ELSE gets the working shell.
 *
 * ── WHERE THE MODE COMES FROM ───────────────────────────────────────────────
 * `shell_mode` is DERIVED BY THE BACKEND (Architecture v2.7 §2.6). A client that
 * decided its own mode could render a rail to a visitor the backend has not
 * authorized one for, so the payload wins whenever it has answered.
 *
 * Until Backend v7.0 Phase 1 ships, it has not answered, and the fallback is the
 * local threshold this surface has always used: has the visitor spoken? That
 * predicate is derived from the transcript rather than from journey state, because
 * journey state can lag a turn behind and the visitor's own first sentence is the
 * honest threshold. When both are absent we resolve to `arrival`, which reveals
 * least.
 *
 * Case 3 is additionally keyed on `/` rather than on any conversation route:
 * /review/<id> always means a thread is intended, so it keeps the working shell
 * even while its transcript is still loading. Otherwise a visitor opening a thread
 * link would see the front door flash before their conversation appeared.
 */
const SELF_CHROMED_PREFIXES = ['/workspace', '/sign-in', '/set-password', '/forgot-password'];

const LEGAL_PATHS = LEGAL_INSTRUMENTS.map((i) => `/${i.slug}`);

function isSelfChromed(pathname: string): boolean {
  return SELF_CHROMED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function ShellModeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const backendMode = useShellContext().shellMode;
  const localArrival = useArrivalMode();

  if (isSelfChromed(pathname)) return <>{children}</>;
  if (LEGAL_PATHS.includes(pathname)) return <>{children}</>;

  const mode = backendMode ?? (localArrival ? 'arrival' : 'working');

  /* The approved front door owns the whole page. */
  if (pathname === '/' && mode === 'arrival') return <ArrivalShell>{children}</ArrivalShell>;

  /* With the conversation surface off, marketing routes render bare rather than
     inside a half-migrated shell. Unchanged from v5.0, and the reason the phase
     stays safe to deploy before the flag is flipped. */
  if (!siteConfig.featureFlags.conversationSurface) return <main id="content">{children}</main>;

  return <WorkingShell>{children}</WorkingShell>;
}
