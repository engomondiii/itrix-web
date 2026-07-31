'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ConversationRail } from './ConversationRail';
import { RailSheet } from './RailSheet';
import { useRailStore } from '@/store/railStore';
import { ContentPane } from '@/components/content-pane/ContentPane';
import { PaneSheet } from '@/components/content-pane/PaneSheet';
import { useContentPaneContext } from '@/context/ContentPaneContext';
import { VerificationNotice } from '@/components/auth/VerificationNotice';
import { RAIL_COPY } from '@/lib/content/composerCopy';

/**
 * THE WORKING SHELL — mounted the moment a thread exists.
 *
 * REPLACES ConversationShell. PHASE 2 COMPLETES IT AT THREE ZONES: the conversation
 * rail, the conversation column, and the content pane.
 *
 * The grid is driven by `data-pane`, so the third column exists only when the pane
 * has something to show. A permanently-reserved empty column would narrow the reading
 * measure for every visitor whose conversation has not produced anything yet — and
 * the measure is the one dimension §25.2 protects above the others.
 *
 * ── THE MODE TRANSITION IS NOT A NAVIGATION ─────────────────────────────────
 * Going from arrival to working mounts the rail AROUND a transcript that is
 * already on screen (Architecture v2.7 §2.6). Because ShellModeGate sits above
 * every route in app/layout.tsx, the tree inside it is never unmounted by the
 * change: the composer keeps focus and an in-flight upload survives. That is a
 * tested acceptance criterion, not an incidental property.
 *
 * ── WHAT THE CONTENT PANE WILL AND WILL NOT CARRY ───────────────────────────
 * Stated here because this is the file that will mount it. The pane renders
 * artifacts, documents and workspace sections. It NEVER carries the
 * next-best-action, the confidentiality notice, quick help, the specialist card,
 * the scheduling card or the satisfaction pulse. Architecture v2.6 §11.6A re-homed
 * every one of those when the old right rail was retired, and v2.7 §2.7 restates
 * the re-homing as a prohibition. The pane is a new zone, not the old rail back.
 *
 * Geometry lives in styles/shell.css so a caller cannot override it.
 *
 * The (portal) zone renders this same shell at a later state. That is a
 * presentation decision only — it shares no auth, no state and no data
 * (Surface 1 v6.0 §7.2).
 */
export function WorkingShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const collapsed = useRailStore((s) => s.collapsed);
  const openSheet = useRailStore((s) => s.openSheet);
  const pane = useContentPaneContext();

  /* THE CONTENT PANE IS SUPPRESSED ON THE CLIENT PAGE (/c/<token>). The personalised
     page is itself the delivered content — it renders its own hero, slide deck and
     "discuss your review" panel — so the right content pane popping in beside it is
     redundant and was appearing unbidden every time a section arrived. We keep the
     LEFT conversation rail (the visitor still needs "New chat" and their history) and
     drop only the right pane here. This is presentation scope, not authorization:
     nothing about what the backend authorized changes. */
  const isClientPage = pathname === '/c' || pathname.startsWith('/c/');

  /* The third column is present when the pane is available and not folded away. On a
     sheet breakpoint it is never a column — PaneSheet renders it as an overlay
     instead, and rendering both would put two copies of the panel in the tree. */
  const paneColumn = !isClientPage && pane.available && !pane.collapsed && !pane.isSheetBreakpoint;

  return (
    <div
      className="working-shell"
      data-collapsed={collapsed ? 'true' : undefined}
      data-pane={paneColumn ? 'true' : undefined}
    >
      <aside className="conversation-rail" aria-label="Your conversations">
        <ConversationRail />
      </aside>

      <main id="content" className="conversation-main" data-pathname={pathname}>
        {/* The only way to reach the rail once it becomes a sheet. The
            conversation header also carries one, but marketing routes have no
            header — so this lives at the shell level. */}
        <button
          type="button"
          className="conversation-main__nav"
          aria-label={RAIL_COPY.openNavigation}
          onClick={openSheet}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* v8.0 — the unconfirmed-address banner (R66). It sits ABOVE the conversation and
            never in the content pane, and it never blocks: an unconfirmed account can type,
            send and receive answers. It returns null unless the backend has actually said the
            address is unconfirmed, so it is inert until Backend v7.2 Phase 4 lands. */}
        <VerificationNotice />

        {children}
      </main>

      {/* THE CONTENT PANE. What it may never carry is stated in ContentPane.tsx and
          asserted in tests/e2e/pane-never-holds-11-6a.spec.ts: no next-best-action, no
          confidentiality notice, no quick help, no specialist or scheduling card, no
          satisfaction pulse. Architecture v2.6 §11.6A re-homed all six when the old
          right value rail was retired, and v2.7 §2.7 restates that as a prohibition.
          The pane is a new zone, not the old rail returning.

          Suppressed on the client page (see isClientPage above): the personalised page
          is its own content surface, so the pane beside it is redundant. */}
      {!isClientPage ? <ContentPane /> : null}

      <RailSheet />
      {!isClientPage ? <PaneSheet /> : null}
    </div>
  );
}
