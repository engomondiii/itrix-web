'use client';

import { useState } from 'react';
import { useShellContext } from '@/context/ShellContext';
import { useSidebarStore } from '@/store/sidebarStore';
import { HEADER_COPY, SIDEBAR_COPY } from '@/lib/content/composerCopy';

/**
 * The conversation header — where the retired right rail's guarantees live.
 *
 * It is a thin, low-chrome strip. What it must NOT become is a dashboard or a
 * status bar full of internal signals (Architecture v2.6 §11.6).
 *
 * It carries the two things that could not be lost when the right value rail was
 * removed (§11.6A):
 *
 *   · the NAMED human owner, from identification onward;
 *   · QUICK HELP — one action to a named human, at every state.
 *
 * R30 IS AN ABSOLUTE, NOT A LAYOUT PREFERENCE. On narrow breakpoints the header
 * collapses, and quick help moves into the thread actions menu. It never
 * disappears.
 *
 * The state chip is plain language — "Assessment", never "State 7", never a
 * stage number, tier or score.
 */
export function ConversationHeader() {
  const { conversationHeader } = useShellContext();
  const openSheet = useSidebarStore((s) => s.openSheet);
  const [helpOpen, setHelpOpen] = useState(false);

  if (!conversationHeader) return null;
  const { title, stateLabel, humanOwner, supportSla, quickHelp } = conversationHeader;

  return (
    <header className="conversation-header">
      <button
        type="button"
        className="conversation-header__nav"
        aria-label={SIDEBAR_COPY.openNavigation}
        onClick={openSheet}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div className="conversation-header__identity">
        <h1 className="conversation-header__title">{title}</h1>
        <span className="conversation-header__chip">{stateLabel}</span>
      </div>

      <div className="conversation-header__reach">
        {humanOwner ? <span className="conversation-header__owner">{humanOwner}</span> : null}
        {supportSla ? <span className="conversation-header__sla">{supportSla}</span> : null}

        {quickHelp ? (
          <div className="conversation-header__help">
            <button
              type="button"
              className="conversation-header__help-button"
              aria-expanded={helpOpen}
              aria-controls="quick-help"
              onClick={() => setHelpOpen((v) => !v)}
            >
              {HEADER_COPY.quickHelp}
            </button>
            <ul id="quick-help" hidden={!helpOpen} className="conversation-header__help-menu">
              {HEADER_COPY.quickHelpExpanded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
