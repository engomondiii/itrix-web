'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RelationshipShell } from '@/components/shell/RelationshipShell';

/**
 * Decides the chrome for each route (Surface 1 v4.0 §3).
 *
 * The public surface is ONE adaptive relationship shell: a quiet enterprise
 * header, an invariant centre, and two rails whose content the backend
 * authorizes. The AppShell / SidebarRail experiment from v3.1 is gone — its left
 * rail was navigation dressed as memory, which is exactly what the left rail
 * must never be.
 *
 * Self-chromed segments keep their own focused chrome and must NOT be wrapped
 * (otherwise two navigations stack):
 *   · /review*            → ReviewLayout owns its header + main
 *   · the (portal) group  → its own PortalShell (own layout.tsx)
 *
 * Add any future fullscreen / self-chromed segment to CHROMELESS_PREFIXES.
 *
 * PHASE 1: journeyNumber is fixed at 1, so the rails render as ambient
 * structure. Phase 2 replaces the constant with `useJourney()` and the same
 * component grows without changing shape.
 */
const CHROMELESS_PREFIXES = ['/review'];

function isChromeless(pathname: string): boolean {
  return CHROMELESS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Self-chromed segment: render bare.
  if (isChromeless(pathname)) return <>{children}</>;

  return (
    <>
      <Header />
      <RelationshipShell journeyNumber={1}>{children}</RelationshipShell>
      <Footer />
    </>
  );
}
