'use client';

import { useEmailVerification } from '@/hooks/useEmailVerification';
import { AUTH_COPY } from '@/lib/content/authCopy';

/**
 * THE UNCONFIRMED-ADDRESS BANNER (Playbook v1.9 §18G, R66).
 *
 * ── IT MUST NEVER READ AS A BLOCK ───────────────────────────────────────────
 * It does not stop anyone typing, sending, or getting an answer, and the copy does not
 * suggest it does. "Confirm your email to continue" would be false and would reintroduce
 * the wait open registration exists to remove. It names one benefit and offers one action.
 *
 * ── AND IT DOES NOT RENDER WHEN WE DO NOT KNOW ──────────────────────────────
 * `verified === null` means `client/me/` did not carry the field — which is the state of
 * every deployment until Backend v7.2 Phase 4 lands. Rendering then would put a permanent
 * notice on every existing customer's workspace on the strength of a missing key.
 *
 * `role="status"`, not `role="alert"`: this is standing information, and an assertive live
 * region would interrupt a screen-reader user mid-conversation to tell them about a
 * mailbox.
 */
export function VerificationNotice() {
  const { verified, resend, resent, busy } = useEmailVerification();

  if (verified !== false) return null;

  return (
    <div className="verify-banner" role="status">
      <p className="verify-banner__body">
        {resent ? AUTH_COPY.verify.bannerSent : AUTH_COPY.verify.bannerBody}
      </p>
      {resent ? null : (
        <button
          type="button"
          className="verify-banner__action"
          disabled={busy}
          onClick={() => void resend()}
        >
          {busy ? AUTH_COPY.verify.resending : AUTH_COPY.verify.bannerAction}
        </button>
      )}
    </div>
  );
}
