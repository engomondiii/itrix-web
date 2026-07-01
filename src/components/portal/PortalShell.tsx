'use client';

import type { ReactNode } from 'react';
import { PortalSidebar } from './PortalSidebar';

/**
 * The portal workspace chrome — warm-paper canvas, own left nav, no public header or
 * footer. Wraps every /workspace screen. The private surface reads distinctly from
 * the public site while staying in the Atelier Indigo system.
 */
export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-canvas">
      <PortalSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
