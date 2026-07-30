'use client';

import { SignInLink } from './SignInLink';
import { LegalStrip } from './LegalStrip';

/**
 * The foot of the conversation rail: sign in, and the legal instruments.
 *
 * v6.0 replaces the old sidebar legal footer. Two deliberate points.
 *
 * THE LABEL IS "SIGN IN", never "NDA access" (Playbook v1.7 §00 change 3).
 *
 * THE LEGAL STRIP HERE IS AN INTERIM. Architecture v2.7 §2.4 puts the four
 * instruments in the content pane's `legal` section in working mode, and the pane
 * is Phase 2. Until it lands they would otherwise be unreachable once a thread
 * exists, and they are not permitted to disappear at any width — so they sit
 * here, and LegalStrip's comment records the move.
 *
 * WHAT THIS IS NOT: an account dashboard, a plan badge, or anywhere an inferred
 * organisation could appear. Phase 3 adds the authenticated name and sign-out
 * alongside the portal auth work; a name is not invented here in the meantime.
 */
export function RailAccountFooter() {
  return (
    <div className="rail-account">
      <SignInLink variant="rail" />
      <LegalStrip variant="rail" />
    </div>
  );
}
