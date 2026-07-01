import type { ReactNode } from 'react';
import { PortalAuthProvider } from '@/context/PortalAuthContext';

/**
 * The (portal) route-group layout. It provides the client-auth context to the whole
 * portal tree (workspace + auth screens) but renders NO public header/footer — the
 * portal is a distinct, signed-in surface inside the same site. The workspace shell
 * chrome is applied per-segment (workspace pages use PortalShell; auth pages use the
 * centered (auth) layout).
 */
export default function PortalRootLayout({ children }: { children: ReactNode }) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>;
}
