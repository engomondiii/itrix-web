'use client';

import type { ReactNode } from 'react';
import { PortalSidebar } from './PortalSidebar';
import { PortalMobileBar } from './PortalMobileBar';
import { PortalNavBackdrop } from './PortalNavBackdrop';

/**
 * The portal workspace chrome — warm-paper canvas, own left nav, no public header or
 * footer. Wraps every /workspace screen. The private surface reads distinctly from
 * the public site while staying in the Brand Manual system.
 *
 * ── MOBILE PORTRAIT (2026-08-12) ────────────────────────────────────────────
 * Below `lg` the sidebar is a DRAWER and `PortalMobileBar` carries the menu button —
 * the fixed 240px column previously left ~150px of usable width on a 390px phone.
 * The column layout, the sidebar itself and every desktop rule are unchanged above
 * that breakpoint; the drawer behaviour is entirely additive and lives in
 * mobile.css, which is imported last.
 */
export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="portal-shell flex min-h-dvh flex-col bg-canvas lg:flex-row">
      <PortalMobileBar />
      <PortalNavBackdrop />
      <PortalSidebar />
      <main className="portal-shell__main min-w-0 flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
