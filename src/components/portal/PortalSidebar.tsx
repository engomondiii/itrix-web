'use client';

import Link from 'next/link';
import { PortalNavLink } from './PortalNavLink';
import { Button } from '@/components/ui/Button';
import { portalNav } from '@/config/navigation.config';
import { usePortalStore } from '@/store/portalStore';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { routes } from '@/constants/routes';
import { brand } from '@/constants/brand';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** The portal's own left navigation — never the public header. */
export function PortalSidebar() {
  const unread = usePortalStore((s) => s.unreadMessages);
  const { signOut } = usePortalAuth();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col gap-6 border-r border-line bg-surface px-4 py-6">
      <Link href={routes.workspaceOverview} className="px-3 text-lg font-bold tracking-tight text-indigo-950">
        iTri<span className="text-gold-500">X</span>
        <span className="ml-2 align-middle text-micro font-semibold uppercase tracking-[0.1em] text-ink-400">
          Workspace
        </span>
      </Link>

      <nav className="flex flex-col gap-1" aria-label="Workspace">
        {portalNav.map((item) => (
          <PortalNavLink
            key={item.key}
            href={item.href}
            label={item.label}
            badge={item.key === 'messages' ? unread : undefined}
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-3">
        <p className="text-caption italic text-ink-400">“{brand.thesis}”</p>
        <Button variant="ghost" size="sm" onClick={() => void signOut()} className="self-start">
          {PORTAL_COPY.settings.signOut}
        </Button>
      </div>
    </aside>
  );
}
