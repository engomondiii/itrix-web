import type { ReactNode } from 'react';
import { PortalAuthProvider } from '@/context/PortalAuthContext';

/**
 * The (portal) route-group layout.
 *
 * It provides the client-auth context to the whole portal tree and renders no
 * public header/footer — the portal is a distinct, signed-in surface inside the
 * same site.
 *
 * PHASE 2: the portal is now understood as THE SAME SHELL at a later state
 * (Surface 1 v4.0 §3.1). The RelationshipShell is mounted per-segment rather
 * than here, because the (auth) screens — sign-in, set-password — deliberately
 * have no rails: someone who has not signed in has no relationship context to
 * show, and rendering an empty shell around a login form would be the "empty
 * decorative dashboard" the spec forbids.
 *
 * Workspace segments mount the shell themselves; see workspace/overview.
 */
export default function PortalRootLayout({ children }: { children: ReactNode }) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>;
}
