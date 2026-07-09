'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';
import { useShellStore } from '@/store/shellStore';
import { SidebarRail } from './SidebarRail';
import { IconPanelLeft } from './ShellIcons';

/**
 * AppShell — the AI-application chrome for the public surface (Surface 1 v3.1).
 *
 * Replaces the traditional top-header layout with a two-pane application shell:
 * a collapsible left rail (SidebarRail) and a wide content canvas. The rail
 * carries the former header navigation; the canvas is where pages render, with a
 * large prompt composer as the landing's centre of gravity.
 *
 * Responsive model:
 *   - lg+ : rail is a fixed column (16rem, or 4.5rem when collapsed); canvas is
 *           padded by the rail width so it never sits under the rail.
 *   - <lg : rail is hidden and opened as a full-height overlay + scrim from a
 *           compact top trigger bar; canvas is full width.
 *
 * Self-chromed segments (/review, portal) do NOT use this shell — SiteChrome
 * decides that and renders them bare.
 */

const RAIL_W = '16rem';
const RAIL_W_COLLAPSED = '4.5rem';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const collapsed = useShellStore((s) => s.collapsed);
  const mobileOpen = useShellStore((s) => s.mobileOpen);
  const openMobile = useShellStore((s) => s.openMobile);
  const closeMobile = useShellStore((s) => s.closeMobile);

  // Close the mobile overlay whenever the route changes.
  useEffect(() => {
    closeMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll while the mobile overlay is open; close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen, closeMobile]);

  const railWidth = collapsed ? RAIL_W_COLLAPSED : RAIL_W;

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Skip link (accessibility parity with the old chrome). */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-indigo-950 focus:px-4 focus:py-2 focus:text-oni"
      >
        Skip to content
      </a>

      {/* ── Desktop rail (fixed column) ─────────────────────────────────── */}
      <aside
        aria-label="Primary navigation"
        className="fixed inset-y-0 left-0 z-40 hidden shrink-0 border-r border-white/5 transition-[width] duration-base ease-out lg:block"
        style={{ width: railWidth }}
      >
        <SidebarRail />
      </aside>

      {/* ── Mobile top trigger bar ──────────────────────────────────────── */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={openMobile}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-700 transition-colors hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
        >
          <IconPanelLeft size={20} />
        </button>
        <Link href={routes.home} className="text-base font-bold tracking-tight text-indigo-950" aria-label={`${brand.name} home`}>
          iTri<span className="text-gold-500">X</span>
        </Link>
      </div>

      {/* ── Mobile overlay rail + scrim ─────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobile}
            className="fixed inset-0 z-40 animate-fade-in bg-indigo-950/40 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[17rem] max-w-[85vw] animate-slide-in-left shadow-3">
            <SidebarRail />
          </div>
        </div>
      )}

      {/* ── Content canvas ──────────────────────────────────────────────── */}
      <div
        className="transition-[padding] duration-base ease-out"
        style={{ paddingLeft: 'var(--rail-pad, 0px)' }}
      >
        {/* The rail padding is applied only at lg+ via a style tag so SSR stays clean. */}
        <style>{`@media (min-width:1024px){[data-shell-canvas]{padding-left:${railWidth};}}`}</style>
        <main id="content" data-shell-canvas className="min-h-[60vh]">
          {children}
        </main>
      </div>
    </div>
  );
}
