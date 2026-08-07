'use client';

import { useState } from 'react';
import { useShellContext } from '@/context/ShellContext';
import { useRailStore } from '@/store/railStore';
import { useComposerStore } from '@/store/composerStore';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { useContentPaneContext } from '@/context/ContentPaneContext';
import { HEADER_COPY, RAIL_COPY } from '@/lib/content/composerCopy';

/**
 * The conversation header — where the retired right rail's guarantees live.
 *
 * It is a thin, low-chrome strip. What it must NOT become is a dashboard or a status
 * bar full of internal signals (Architecture v2.7 §11.6).
 *
 * It carries the two things that could not be lost when the right value rail was
 * removed (§11.6A):
 *
 *   · the NAMED human owner, from identification onward;
 *   · QUICK HELP — one action to a named human, at every state.
 *
 * R30 IS AN ABSOLUTE, NOT A LAYOUT PREFERENCE. On narrow breakpoints the header
 * collapses, and quick help moves into the thread actions menu. It never disappears,
 * AND IT NEVER MOVES INTO THE CONTENT PANE — v2.7 §2.7 restates that as a
 * prohibition, because the pane is a reading surface and the visitor's route to a
 * human is not something to read.
 *
 * The state chip is plain language — "Assessment", never "State 7", never a stage
 * number, tier or score.
 *
 * v6.0 PHASE 2: THE CONTENT CONTROL IS LIVE. It renders only when the pane is
 * `available` — the flag is on and at least one section can be filled — so it is
 * never a button that opens nothing.
 *
 * It does two different things at two widths, which is correct rather than untidy:
 * below 1024px the pane is an overlay and this OPENS THE SHEET; above it, the pane is
 * a column and this COLLAPSES OR EXPANDS it. The label follows the state, not the
 * breakpoint, so it always says what pressing it will do.
 */
export function ConversationHeader() {
  const { conversationHeader } = useShellContext();
  const openSheet = useRailStore((s) => s.openSheet);
  const pane = useContentPaneContext();
  const [helpOpen, setHelpOpen] = useState(false);
  const populate = useComposerStore((st) => st.populate);
  const requestFocus = useComposerStore((st) => st.requestFocus);

  if (!conversationHeader) return null;
  const { title, stateLabel, humanOwner, supportSla, quickHelp } = conversationHeader;

  return (
    <header className="conversation-header">
      <button
        type="button"
        className="conversation-header__nav"
        aria-label={RAIL_COPY.openNavigation}
        onClick={openSheet}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div className="conversation-header__identity">
        {/*
          A `h2`, not a `h1`. From v6.0 the platform's single `h1` is the main
          question, and a thread title competing with it would give the route two
          top-level headings (Surface 1 v6.0 §7.4).
        */}
        <h2 className="conversation-header__title">{title}</h2>
        <span className="conversation-header__chip">{stateLabel}</span>
      </div>

      <div className="conversation-header__reach">
        {pane.available ? (
          <button
            type="button"
            className="conversation-header__content"
            aria-expanded={pane.isSheetBreakpoint ? pane.sheetOpen : !pane.collapsed}
            onClick={() => {
              if (pane.isSheetBreakpoint) {
                if (pane.sheetOpen) pane.closeSheet();
                else pane.openSheet();
                return;
              }
              pane.toggleCollapsed();
            }}
          >
            {(pane.isSheetBreakpoint ? pane.sheetOpen : !pane.collapsed)
              ? HEADER_COPY.hideContent
              : HEADER_COPY.openContent}
          </button>
        ) : null}

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
            {/* Each item now DOES something: it puts an opening sentence in the
                composer and returns focus there, so the request goes down the same
                governed path as any other turn rather than into a dead menu. */}
            <ul id="quick-help" hidden={!helpOpen} className="conversation-header__help-menu">
              {HEADER_COPY.quickHelpExpanded.map((item, i) => (
                <li key={item}>
                  <button
                    type="button"
                    className="conversation-header__help-item"
                    onClick={() => {
                      populate(HEADER_COPY.quickHelpPrompts[i] ?? item);
                      requestFocus();
                      setHelpOpen(false);
                      trackEvent('help.action_chosen', { action: item });
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li className="conversation-header__help-hint">{HEADER_COPY.quickHelpHint}</li>
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
