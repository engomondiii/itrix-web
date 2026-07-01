import type { ReactNode } from 'react';
import { PortalShell } from '@/components/portal/PortalShell';

/** Wraps every /workspace screen in the portal chrome (sidebar + warm canvas). */
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
