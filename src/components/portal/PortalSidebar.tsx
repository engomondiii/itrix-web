'use client';

import Link from 'next/link';
import { PortalNavLink } from './PortalNavLink';
import { Button } from '@/components/ui/Button';
import { portalNav } from '@/config/navigation.config';
import { usePortalStore } from '@/store/portalStore';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { useJourneyContext } from '@/context/JourneyContext';
import { routes } from '@/constants/routes';
import { brand } from '@/constants/brand';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/**
 * The portal's own left navigation — never the public header.
 *
 * PHASE 3: entries carrying a `minJourneyNumber` stay hidden until the state
 * that owns them. A customer at State 6 has no assessment to open, and an empty
 * Assessment tab is exactly the "empty decorative dashboard" the spec forbids.
 *
 * This is a PRESENTATION rule and nothing more. Django re-authorizes every fetch
 * regardless of what the nav shows, so a customer who types the URL of a screen
 * they have not reached gets the backend's answer, not a hidden door.
 */
export function PortalSidebar() {
  const unread = usePortalStore((s) => s.unreadMessages);
  const { signOut } = usePortalAuth();
  const { journeyNumber } = useJourneyContext();

  const visible = portalNav.filter(
    (item) => item.minJourneyNumber === undefined || (journeyNumber ?? 0) >= item.minJourneyNumber,
  );

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col gap-6 border-r border-border-medium bg-surface px-4 py-6">
      <Link href={routes.workspaceOverview} className="px-3 text-lg font-bold tracking-tight text-structure-900">
        iTri<span className="text-accent">X</span>
        <span className="ml-2 align-middle text-micro font-semibold uppercase tracking-[0.1em] text-ink-secondary">
          Workspace
        </span>
      </Link>

      <nav className="flex flex-col gap-1" aria-label="Workspace">
        {visible.map((item) => (
          <PortalNavLink
            key={item.key}
            href={item.href}
            label={item.label}
            badge={item.key === 'messages' ? unread : undefined}
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-3">
        <p className="text-caption italic text-ink-secondary">“{brand.thesis}”</p>
        <Button variant="ghost" size="sm" onClick={() => void signOut()} className="self-start">
          {PORTAL_COPY.settings.signOut}
        </Button>
      </div>
    </aside>
  );
}
