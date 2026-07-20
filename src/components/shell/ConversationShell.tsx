'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ConversationSidebar } from './ConversationSidebar';
import { SidebarSheet } from './SidebarSheet';
import { useSidebarStore } from '@/store/sidebarStore';
import { SIDEBAR_COPY } from '@/lib/content/composerCopy';

/**
 * THE CONVERSATION SHELL — two columns, and there is no third.
 *
 * This replaces the v4.0 RelationshipShell. The right VALUE rail is retired to
 * give the conversation its width; every governance-critical payload it carried
 * was re-homed to the composer footer, the conversation header, inline cards or
 * the sidebar before the rail was removed (Architecture v2.6 §11.6A) — none of
 * it was simply deleted.
 *
 * The left rail survives with a changed purpose. In v4.0 it was relationship
 * memory; here it is NAVIGATION: brand, new review, the conversation list,
 * workspace sections, explore and legal. The memory it used to summarise is now
 * visible in the transcript itself.
 *
 * Geometry lives in styles/shell.css so a caller cannot override it:
 *   ≥1280px  sidebar 280px, conversation fills the rest at a readable measure
 *   ≥1024px  sidebar collapsible to icons
 *   <1024px  sidebar becomes a sheet; the conversation is full width
 *
 * The (portal) zone renders this same shell at a later state. That is a
 * presentation decision only — it shares no auth, no state and no data
 * (Surface 1 v5.0 §7.2).
 */
export function ConversationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const openSheet = useSidebarStore((s) => s.openSheet);

  return (
    <div className="conversation-shell" data-collapsed={collapsed ? 'true' : undefined}>
      <aside className="conversation-sidebar" aria-label="Conversations and navigation">
        <ConversationSidebar />
      </aside>

      <main id="content" className="conversation-main" data-pathname={pathname}>
        {/* The only way to reach navigation once the sidebar becomes a sheet.
            The conversation header also carries one, but marketing routes have
            no header — so this lives at the shell level. */}
        <button
          type="button"
          className="conversation-main__nav"
          aria-label={SIDEBAR_COPY.openNavigation}
          onClick={openSheet}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {children}
      </main>

      <SidebarSheet />
    </div>
  );
}
