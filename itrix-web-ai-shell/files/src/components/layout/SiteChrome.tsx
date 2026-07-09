'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';

/**
 * Decides the chrome for each route (Surface 1 v3.1).
 *
 * The public surface is now presented as an AI-application shell (AppShell): a
 * collapsible left rail carrying the former header navigation, and a wide content
 * canvas. This replaces the traditional Header/Footer marketing chrome on all
 * public routes.
 *
 * Self-chromed segments keep their own focused chrome and must NOT be wrapped by
 * the shell (otherwise two navigations stack):
 *   - /review*  → ReviewLayout owns its header + main.
 *   - the (portal) route group → its own PortalShell (own layout.tsx).
 *
 * Add any future fullscreen / self-chromed segment to CHROMELESS_PREFIXES.
 */
const CHROMELESS_PREFIXES = ['/review'];

function isChromeless(pathname: string): boolean {
  return CHROMELESS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Self-chromed segment (ReviewLayout / portal own their chrome): render bare.
  if (isChromeless(pathname)) return <>{children}</>;

  // All other public routes render inside the AI-app shell.
  return <AppShell>{children}</AppShell>;
}
