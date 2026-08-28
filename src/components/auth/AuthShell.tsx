'use client';

import type { ReactNode } from 'react';
import { WordmarkLockup } from '@/components/shell/WordmarkLockup';
import { LegalStrip } from '@/components/shell/LegalStrip';
import { ArrivalMotifs } from '@/components/arrival/ArrivalMotifs';
import { SiteLocaleToggle } from '@/components/i18n/SiteLocaleToggle';

/**
 * THE AUTHENTICATION ZONE'S CHROME (Architecture v2.8 §26.3, R46, R56).
 *
 * ── WHY THIS COMPONENT IS THE WHOLE POINT OF PHASE 4 ────────────────────────
 *
 * The complaint was that the sign-in screen is "basic and ugly". The cause was not a
 * missing gradient: these four routes were built in v3.1 and never revisited while the
 * rest of the surface was rewritten twice. They had no wordmark, no glass, no geometry,
 * and none of the §21.12 type scale. A visitor who had just read a question set at 56px
 * on a glass surface then landed on a bare white form — which tells them something
 * about how much the two screens matter to us.
 *
 * The fix is CONTINUITY, and it is structural rather than a styling intention: this
 * shell mounts the SAME `WordmarkLockup`, the SAME `ArrivalMotifs` and the SAME
 * `LegalStrip` the arrival screen uses. Three shared components mean the auth zone
 * cannot drift away from the front door again, because there is nothing separate to
 * drift.
 *
 * ── THE LEGAL STRIP IS NOT OPTIONAL HERE (R56) ──────────────────────────────
 * §2.4 says the four instruments are "not permitted to disappear at any width", and a
 * sign-in page is not an exception. It is, if anything, the screen where a returning
 * customer is most likely to want to check what they agreed to. These routes are
 * chrome-free by `ShellModeGate`, so the strip has to travel with this shell or it does
 * not exist in the zone at all.
 *
 * ── WHAT IT MUST NEVER CARRY ────────────────────────────────────────────────
 * Marketing navigation, product links, the Explore set, a customer logo, an
 * organisation name, or any greeting that implies recognition (R57). An
 * unauthenticated route knows nothing about who is looking at it, and the correct
 * behaviour is to say nothing.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page">
      <header className="auth-bar">
        <WordmarkLockup variant="arrival" />
        <SiteLocaleToggle compact />
      </header>

      <main id="content" className="auth-main">
        <ArrivalMotifs />
        <div className="auth-stage">{children}</div>
      </main>

      <LegalStrip variant="arrival" />
    </div>
  );
}
