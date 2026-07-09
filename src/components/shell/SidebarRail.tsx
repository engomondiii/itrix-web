'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';
import { CTA } from '@/lib/content/ctaCopy';
import { shellNav } from '@/config/shellNav.config';
import type { ShellNavItem } from '@/config/shellNav.config';
import { useShellStore } from '@/store/shellStore';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconArrowUp,
  IconBook,
  IconClose,
} from './ShellIcons';

/**
 * SidebarRail — the left rail of the AI-app shell (Surface 1 v3.1).
 *
 * Carries everything the old top header held — the wordmark, the primary
 * navigation, the "pulled, not pushed" learn-more entry, and the single primary
 * action ("Begin Compute Review") — in a vertical rail that collapses to a thin
 * icon strip (desktop) and slides in as an overlay (mobile). It never renders on
 * self-chromed segments (/review, portal); AppShell decides that.
 */

function isActive(pathname: string, href: string): boolean {
  if (href === routes.home) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href={routes.home}
      aria-label={`${brand.name} home`}
      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-oni transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      <span
        aria-hidden
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/5 font-bold text-oni ring-1 ring-white/10"
      >
        i<span className="text-gold-400">X</span>
      </span>
      {!collapsed && (
        <span className="text-lg font-bold tracking-tight text-oni">
          iTri<span className="text-gold-400">X</span>
        </span>
      )}
    </Link>
  );
}

function NavRow({
  item,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: ShellNavItem;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item.href);
  const childActive = item.children?.some((c) => isActive(pathname, c.href)) ?? false;
  const [open, setOpen] = useState<boolean>(childActive);

  const rowClass = cn(
    'group relative flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-secondary font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400',
    active || childActive ? 'bg-white/10 text-oni' : 'text-oni/70 hover:bg-white/5 hover:text-oni',
  );

  const activeBar = (
    <span
      aria-hidden
      className={cn(
        'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-pill bg-gold-500 transition-opacity',
        active || childActive ? 'opacity-100' : 'opacity-0',
      )}
    />
  );

  // Collapsed rail: icon-only link, tooltip via title.
  if (collapsed) {
    return (
      <Link
        href={item.href}
        title={item.label}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}
        className={cn(rowClass, 'justify-center px-0')}
      >
        {activeBar}
        <span className="shrink-0">{item.icon}</span>
      </Link>
    );
  }

  // Expanded rail with children: a disclosure that reveals the sub-links.
  if (item.children) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={rowClass}
        >
          {activeBar}
          <span className="shrink-0">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          <IconChevronDown
            size={16}
            className={cn('shrink-0 opacity-60 transition-transform duration-base', open && 'rotate-180')}
          />
        </button>
        {open && (
          <ul className="mb-1 ml-[1.85rem] mt-0.5 flex flex-col gap-0.5 border-l border-white/10 pl-2">
            {item.children.map((child) => {
              const ca = isActive(pathname, child.href);
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={onNavigate}
                    aria-current={ca ? 'page' : undefined}
                    className={cn(
                      'block rounded-sm px-2.5 py-1.5 text-secondary transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400',
                      ca ? 'text-oni' : 'text-oni/60 hover:bg-white/5 hover:text-oni',
                    )}
                  >
                    {child.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  // Expanded rail, leaf link.
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={rowClass}
    >
      {activeBar}
      <span className="shrink-0">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
    </Link>
  );
}

export function SidebarRail() {
  const pathname = usePathname();
  const collapsed = useShellStore((s) => s.collapsed);
  const toggleCollapsed = useShellStore((s) => s.toggleCollapsed);
  const closeMobile = useShellStore((s) => s.closeMobile);

  // On mobile the rail is always shown fully (never the icon-only form).
  const isMobileOverlay = useShellStore((s) => s.mobileOpen);
  const effectiveCollapsed = isMobileOverlay ? false : collapsed;

  return (
    <div
      data-surface="indigo"
      className="on-indigo flex h-full flex-col bg-indigo-950 text-oni"
    >
      {/* Head: wordmark + collapse control */}
      <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-4">
        <Wordmark collapsed={effectiveCollapsed} />
        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-oni/70 transition-colors hover:bg-white/10 hover:text-oni focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 lg:inline-flex"
        >
          {collapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
        </button>
        {/* Mobile close */}
        <button
          type="button"
          onClick={closeMobile}
          aria-label="Close menu"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-oni/70 transition-colors hover:bg-white/10 hover:text-oni focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 lg:hidden"
        >
          <IconClose size={18} />
        </button>
      </div>

      {/* Primary action — the one CTA, always reachable */}
      <div className={cn('px-3 pb-3', effectiveCollapsed && 'px-2')}>
        <Link
          href={CTA.beginReview.href}
          onClick={closeMobile}
          title={CTA.beginReview.label}
          className={cn(
            'flex items-center gap-2 rounded-md bg-sapphire-600 font-semibold text-white shadow-1 transition-colors hover:bg-sapphire-500 active:bg-sapphire-700',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950',
            effectiveCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5 text-secondary',
          )}
        >
          <IconArrowUp size={18} className="shrink-0" />
          {!effectiveCollapsed && <span className="flex-1 text-left">{CTA.beginReview.label}</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Primary"
        className="flex-1 overflow-y-auto px-3 pb-4"
      >
        {!effectiveCollapsed && (
          <p className="px-2.5 pb-1.5 pt-2 text-micro font-semibold uppercase tracking-[0.12em] text-oni/40">
            Explore
          </p>
        )}
        <div className="flex flex-col gap-0.5">
          {shellNav.map((item) => (
            <NavRow
              key={item.label}
              item={item}
              collapsed={effectiveCollapsed}
              pathname={pathname}
              onNavigate={closeMobile}
            />
          ))}
        </div>

        {/* Pulled, not pushed: quiet learn-more entry to the homepage drawers */}
        {!effectiveCollapsed && (
          <>
            <p className="px-2.5 pb-1.5 pt-5 text-micro font-semibold uppercase tracking-[0.12em] text-oni/40">
              Learn more
            </p>
            <Link
              href={{ pathname: routes.home, hash: 'learn-more' }}
              onClick={closeMobile}
              className="group flex items-center gap-3 rounded-md px-2.5 py-2 text-secondary text-oni/70 transition-colors hover:bg-white/5 hover:text-oni focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              <IconBook size={18} className="shrink-0" />
              <span className="flex-1">Understand itriX</span>
            </Link>
          </>
        )}
      </nav>

      {/* Foot: positioning line + legal, hidden when collapsed */}
      {!effectiveCollapsed && (
        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-caption leading-snug text-oni/60">{brand.positioning}</p>
          <p className="mt-2 text-micro text-oni/40">
            © {brand.legalEntity}
          </p>
        </div>
      )}
    </div>
  );
}
