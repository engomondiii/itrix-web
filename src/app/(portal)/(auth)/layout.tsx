import type { ReactNode } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';

/**
 * The authentication zone's layout.
 *
 * ── THE SHELL IS MOUNTED HERE, NOT PER PAGE (R46) ───────────────────────────
 * Every route in the zone gets the wordmark, the geometry and the PINNED LEGAL STRIP
 * because the layout provides them — not because each page remembered to. That is what
 * makes "no route in the zone renders bare" a structural property rather than a
 * convention four files have to keep.
 *
 * v3.1's layout did a simpler version of this: a centred box, an inline wordmark drawn
 * with a `<span>`, and the brand thesis in italics underneath. It is replaced rather
 * than extended, because the point of Phase 4 is that these screens use the SAME
 * components as the front door.
 */
export default function PortalAuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
