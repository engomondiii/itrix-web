'use client';

import { useRailCopy } from '@/lib/i18n/conversationLocale';

import { createElement } from 'react';
import type { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { useShellContext } from '@/context/ShellContext';
import { useThreadContext } from '@/context/ThreadContext';
import { useComposerStore } from '@/store/composerStore';
import { useRailStore } from '@/store/railStore';
import { WordmarkLockup } from './WordmarkLockup';
import { NewChatButton } from './NewChatButton';
import { ConversationList } from './ConversationList';
import { RailAccountFooter } from './RailAccountFooter';
import type { ConversationRailSection } from '@/lib/journey/railSections';

/**
 * THE CONVERSATION RAIL — navigation between conversations, and nothing else.
 *
 * REPLACES ConversationSidebar. The difference is not cosmetic. The v5.0 sidebar
 * carried brand navigation, an Explore group of marketing routes and drawers, a
 * legal footer, and a growing family of workspace sections. In v6.0 all of that
 * is gone from the rail (Architecture v2.7 §11.6):
 *
 *   · `Approach`, `Technology` and `Resources` are RETIRED AS NAVIGATION on every
 *     surface. Their routes stay live and in the sitemap.
 *   · Explore and legal became CONTENT-PANE sections (Phase 2). The legal strip
 *     sits in the rail footer as an interim — see LegalStrip.
 *   · Every workspace and State 10 section became a content-pane section. The rail
 *     NEVER GROWS: it is new_chat, conversations, account at every state.
 *
 * IT IS RENDERED, NOT DECIDED. The order comes from the journey payload via
 * ShellContext. A key outside the closed vocabulary is dropped upstream in
 * railSectionsFromContract, so nothing unauthorized can be drawn here — and a
 * visitor cannot widen their own rail, because nothing here computes entitlement
 * from anything they control.
 *
 * WHAT IT MUST NEVER BECOME: a persona label, a score, a stage number, an
 * inferred organisation, or a surveillance-looking profile of the person reading
 * it.
 */
const SECTIONS: Readonly<Record<ConversationRailSection, () => ReactElement>> = {
  new_chat: () => createElement(NewChatButton),
  conversations: () => createElement(ConversationList),
  account: () => createElement(RailAccountFooter),
};

export function ConversationRail({ inSheet = false }: { inSheet?: boolean }) {
  const railCopy = useRailCopy();
  const { conversationRailSections } = useShellContext();
  const { startNew } = useThreadContext();
  const clearComposer = useComposerStore((s) => s.clear);
  const collapsed = useRailStore((s) => s.collapsed);
  const toggleCollapsed = useRailStore((s) => s.toggleCollapsed);
  const closeSheet = useRailStore((s) => s.closeSheet);
  const router = useRouter();

  /* `account` is pinned to the bottom by the layout, not by reordering the
     contract — the backend's order is preserved for everything above it. */
  const body = conversationRailSections.filter((k) => k !== 'account');
  const hasAccount = conversationRailSections.includes('account');

  return (
    <div className="conversation-rail__inner" data-collapsed={!inSheet && collapsed ? 'true' : undefined}>
      <div className="conversation-rail__brand">
        <WordmarkLockup
          variant="rail"
          onActivate={() => {
            startNew();
            clearComposer();
            closeSheet();
            router.push('/');
          }}
        />
      </div>

      <div className="conversation-rail__body">
        {body.map((key) => (
          <div key={key} className="rail-section" data-section={key}>
            {SECTIONS[key]()}
          </div>
        ))}
      </div>

      {hasAccount ? (
        <div className="conversation-rail__foot">
          <div className="rail-section" data-section="account">
            {SECTIONS.account()}
          </div>
        </div>
      ) : null}

      {!inSheet ? (
        <button
          type="button"
          className="conversation-rail__collapse"
          aria-label={collapsed ? railCopy.expand : railCopy.collapse}
          onClick={toggleCollapsed}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d={collapsed ? 'm10 6 6 6-6 6' : 'm14 6-6 6 6 6'} />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
