'use client';

import type { ReactNode } from 'react';
import { WordmarkLockup } from './WordmarkLockup';
import { SignInLink } from './SignInLink';
import { LegalStrip } from './LegalStrip';
import { ArrivalMotifs } from '@/components/arrival/ArrivalMotifs';
import { SiteLocaleToggle } from '@/components/i18n/SiteLocaleToggle';

/**
 * THE ARRIVAL SHELL — the front door, before the visitor has spoken.
 *
 * REPLACES ArrivalLanding, and it is a much smaller thing than what it replaces.
 * v6.0 removed four whole components from this screen because the change request
 * removed the four things they drew (Playbook v1.7 §00, Surface 1 v6.0 §00.1):
 *
 *   ArrivalHeader      the navigation links, and the "NDA access" button. The
 *                      links are gone; the button became "Sign in".
 *   ArrivalLeftRail    the quiet stage rail.
 *   ArrivalRightRail   the disclosure-and-control rail.
 *   ArrivalFooter      the dark footer. Replaced by the pinned legal strip.
 *
 * WHAT IS LEFT, and it is the whole point: a wordmark, a way to sign in, the
 * question, and the four legal instruments.
 *
 * ── THE ONE CONSEQUENCE WORTH KNOWING ───────────────────────────────────────
 * The only outbound links on this route are Sign in and the four instruments
 * (R32). A first-time visitor who does not type cannot reach the product pages
 * from `/`. Those routes remain live and in the sitemap, and Phase 2 makes them
 * reachable from the content pane's Explore section. This is recorded in
 * Architecture v2.7 §00.2 as a marketing-reach decision needing sign-off, not as
 * an oversight.
 *
 * ── WHY THE LEGAL STRIP IS NOT "BELOW THE FOLD" ─────────────────────────────
 * It occupies the bottom edge of the first viewport and does not scroll. R29
 * forbids scrollable NARRATIVE below the prompts; it has never permitted the legal
 * instruments to be unreachable.
 *
 * IT MOUNTS NO OTHER SHELL AND IS MOUNTED BY NO OTHER SHELL. ShellModeGate
 * renders this or the working shell, never both — that single-owner rule is what
 * prevents the duplicate-rail class of bug this surface has hit before.
 */
export function ArrivalShell({ children }: { children: ReactNode }) {
  return (
    <div className="arrival-page" data-journey-state="arrival">
      <header className="arrival-bar">
        <WordmarkLockup variant="arrival" />
        <div className="flex items-center gap-3">
          <SiteLocaleToggle compact />
          <SignInLink variant="arrival" />
        </div>
      </header>

      <main id="content" className="arrival-hero">
        <ArrivalMotifs />
        <div className="arrival-stage">{children}</div>
      </main>

      <LegalStrip variant="arrival" />
    </div>
  );
}
