'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ConversationShell } from '@/components/shell/ConversationShell';
import { siteConfig } from '@/config/site.config';

/**
 * Decides the chrome for each route (Surface 1 v5.0 §3).
 *
 * The public surface is ONE CONVERSATION SHELL: a sidebar and a conversation
 * column. The v4.0 RelationshipShell is gone, and with it the right value rail —
 * every payload the rail carried was re-homed before it was removed
 * (Architecture v2.6 §11.6A).
 *
 * Self-chromed segments keep their own chrome and must NOT be wrapped, or two
 * navigations stack:
 *   · the (portal) group → its own PortalShell (own layout.tsx)
 *
 * NOTE: /review is no longer chromeless. In v4.0 it was a separate funnel
 * surface with its own ReviewLayout; in v5.0 a review IS the conversation, so it
 * renders inside the same shell as everything else.
 *
 * The flag makes this reversible in production: with
 * NEXT_PUBLIC_ENABLE_CONVERSATION_SURFACE off, routes render bare rather than
 * inside a half-migrated shell.
 */
const CHROMELESS_PREFIXES = ['/workspace', '/sign-in', '/set-password', '/forgot-password'];

function isChromeless(pathname: string): boolean {
  return CHROMELESS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isChromeless(pathname)) return <>{children}</>;
  if (!siteConfig.featureFlags.conversationSurface) return <main id="content">{children}</main>;

  return <ConversationShell>{children}</ConversationShell>;
}
