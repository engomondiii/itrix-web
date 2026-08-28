'use client';

import { useRailCopy } from '@/lib/i18n/conversationLocale';

import { useEffect } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ItrixLogo } from '@/components/brand/ItrixLogo';
import { PortalConversationList } from './PortalConversationList';
import { PortalNavLink } from './PortalNavLink';
import { Button } from '@/components/ui/Button';
import { portalNav } from '@/config/navigation.config';
import { usePortalStore } from '@/store/portalStore';
import { usePortalNavStore } from '@/store/portalNavStore';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { usePortalUnread } from '@/hooks/usePortalUnread';
import { useJourneyContext } from '@/context/JourneyContext';
import { useThreadContext } from '@/context/ThreadContext';
import { useComposerStore } from '@/store/composerStore';
import { routes } from '@/constants/routes';
import { brand } from '@/constants/brand';
import { usePortalCopy } from '@/lib/i18n/portalLocale';
import { useLocaleStore } from '@/store/localeStore';
import { portalNavLabel } from '@/lib/i18n/portalConfigLocale';

/**
 * The portal's own left navigation — never the public header.
 *
 * ── 2026-08-10: THE SIDEBAR IS THE WHOLE WORKSPACE MAP ──────────────────────
 * Continuing a conversation used to route through the public surface, whose
 * conversation rail then mounted BESIDE this sidebar — the reported "second
 * sidebar". The cure has two halves: the thread URLs now stay inside
 * /workspace (see setThreadUrl), and the things the rail existed to offer —
 * "New chat" and "Your conversations" — live HERE, natively, visible the
 * moment the workspace opens. One surface, one sidebar.
 *
 * The nav itself is grouped the way the relationship reads — the workspace
 * first, then the delivery track, then settings — each item with a quiet
 * 1.6-stroke glyph from the house icon vocabulary. `minJourneyNumber` still
 * hides screens the journey has not reached (PHASE 3 rule, unchanged):
 * presentation only, never authorization — Django re-authorizes every fetch.
 */

/** The house glyphs — 24-viewBox, 1.6 stroke, currentColor, like every other icon on the surface. */
const NAV_ICONS: Record<string, ReactElement> = {
  overview: (
    <path d="M4 11.5 12 5l8 6.5M6 10v8.5h4.5V14h3v4.5H18V10" />
  ),
  success: (
    <path d="M4 6.5h16M4 12h16M4 17.5h9" />
  ),
  messages: (
    <path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3.5V7a1 1 0 0 1 1-1Z" />
  ),
  briefing: (
    <path d="M8 4h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM10 9h4M10 12.5h4M10 16h2.5" />
  ),
  documents: (
    <path d="M4 7a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z" />
  ),
  evaluation: (
    <path d="M5 19V10M10 19V5.5M15 19v-6M20 19V8.5M3.5 19h17" />
  ),
  assessment: (
    <path d="M9 5h6M8 5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1M9.5 13l2 2 3.5-4" />
  ),
  poc: (
    <path d="M10 4v5.5L5.5 17a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L14 9.5V4M8.5 4h7" />
  ),
  integration: (
    <path d="M9 7V4.5M15 7V4.5M7 7h10v5a5 5 0 0 1-10 0V7ZM12 17v3" />
  ),
  settings: (
    <path d="M12 9.5A2.5 2.5 0 1 1 12 14.5 2.5 2.5 0 0 1 12 9.5ZM12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4" />
  ),
};

function NavGlyph({ itemKey }: { itemKey: string }) {
  const glyph = NAV_ICONS[itemKey];
  if (!glyph) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyph}
    </svg>
  );
}

/** The relationship's reading order: the workspace, then the delivery track, then settings. */
const GROUPS: readonly (readonly string[])[] = [
  ['overview', 'success', 'messages', 'briefing', 'documents'],
  ['evaluation', 'assessment', 'poc', 'integration'],
  ['settings'],
];

export function PortalSidebar() {
  const railCopy = useRailCopy();
  const portalCopy = usePortalCopy();
  const locale = useLocaleStore((s) => s.locale);
  const unread = usePortalStore((s) => s.unreadMessages);
  /* The badge's data supply (fix, 2026-08-10): nothing mounted the old overview
     hook, so `unreadMessages` was never written and the Messaging badge never
     showed. The sidebar is on every workspace screen, so the poll lives here. */
  usePortalUnread();
  const { signOut } = usePortalAuth();
  const { journeyNumber } = useJourneyContext();
  const { startNew } = useThreadContext();
  const clearComposer = useComposerStore((s) => s.clear);
  const router = useRouter();
  const pathname = usePathname();
  const navOpen = usePortalNavStore((s) => s.open);
  const closeNav = usePortalNavStore((s) => s.closeNav);

  const visible = portalNav.filter(
    (item) => item.minJourneyNumber === undefined || (journeyNumber ?? 0) >= item.minJourneyNumber,
  );
  const groups = GROUPS.map((keys) => visible.filter((i) => keys.includes(i.key))).filter(
    (g) => g.length > 0,
  );

  /* ── DRAWER BEHAVIOUR, MOBILE ONLY (2026-08-12) ────────────────────────────
     `data-open` drives the transform in mobile.css. Above `lg` that stylesheet does
     not apply the drawer rules at all, so on desktop this attribute is inert and the
     sidebar renders exactly as it did before.

     Closing on navigation is not a nicety: a drawer that stays open covers the screen
     the customer just chose, so the tap appears to have done nothing. `pathname` is
     the trigger rather than the click handler, so it also closes for a back/forward
     navigation and for anything else that changes route. */
  useEffect(() => {
    closeNav();
  }, [pathname, closeNav]);

  /* Escape closes it — the same affordance as the backdrop, for a keyboard on a
     tablet. Bound only while open so there is no idle listener. */
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen, closeNav]);

  return (
    <aside
      id="portal-sidebar"
      data-open={navOpen ? 'true' : undefined}
      className="portal-sidebar sticky top-0 flex h-dvh w-60 shrink-0 flex-col gap-5 overflow-hidden border-r border-border-medium bg-surface px-4 py-6"
    >
      {/* THE MARK, NOT A TYPESET APPROXIMATION (see the logo refresh note). */}
      <Link href={routes.workspaceOverview} className="flex flex-col gap-1 px-3">
        <ItrixLogo width={112} priority />
        <span className="text-micro font-semibold uppercase tracking-[0.1em] text-ink-secondary">
          {locale === 'ko' ? '워크스페이스' : 'Workspace'}
        </span>
      </Link>

      <nav className="flex flex-col gap-4" aria-label={locale === 'ko' ? '워크스페이스' : 'Workspace'}>
        {groups.map((group, gi) => (
          <div
            key={group[0].key}
            className={gi > 0 ? 'border-t border-border-soft pt-4' : undefined}
          >
            <div className="flex flex-col gap-0.5">
              {group.map((item) => (
                <PortalNavLink
                  key={item.key}
                  href={item.href}
                  label={portalNavLabel(locale, item.key, item.label)}
                  icon={<NavGlyph itemKey={item.key} />}
                  badge={item.key === 'messages' ? unread : undefined}
                  onClick={
                    item.key === 'overview'
                      ? () => {
                          startNew();
                          clearComposer();
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── ORDER, AS REQUESTED (2026-08-10) ───────────────────────────────────
          New chat sits directly beneath the nav (so immediately under Settings,
          its last item) and directly above the conversation list it starts a new
          member of. The thesis line then closes the sidebar under the
          conversations, where it reads as a signature rather than a caption on
          the navigation. */}
      <div className="border-t border-border-soft pt-4">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md border border-border-medium bg-canvas px-3 py-2 text-body font-medium text-ink-primary transition-colors hover:bg-soft"
          onClick={() => {
            startNew();
            clearComposer();
            router.push(routes.workspace);
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          {locale === 'ko' ? '새 대화' : railCopy.newChat}
        </button>
      </div>

      {/* Your conversations — visible the moment the workspace opens. */}
      <div className="min-h-0 flex-1">
        <PortalConversationList />
      </div>

      <div className="flex flex-col gap-3 border-t border-border-soft px-3 pt-4">
        <p className="text-caption italic text-ink-secondary">“{brand.thesis}”</p>
        <Button variant="ghost" size="sm" onClick={() => void signOut()} className="self-start">
          {portalCopy.settings.signOut}
        </Button>
      </div>
    </aside>
  );
}
