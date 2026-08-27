'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InviteCodeField } from '@/components/auth/InviteCodeField';
import { useSignUp } from '@/hooks/useSignUp';
import { AUTH_COPY } from '@/lib/content/authCopy';

/**
 * THE INVITATION CODE — second, and collapsed (Surface 1 v8.0 §16.7).
 *
 * ── WHY IT MOVED RATHER THAN CHANGED ────────────────────────────────────────
 * v7.0 gave the code its own co-equal "door", above a section explaining that there was
 * no registration form. That told the overwhelming majority of people arriving here —
 * who have no code — that they were in the wrong place.
 *
 * So the field is unchanged and its position is not: one line of text that opens one
 * field. `InviteCodeField` itself is untouched, including its single honest failure
 * message for unknown, used and expired alike (R54). The code path works; it is not
 * being rewritten for a layout change.
 *
 * ── AND IT HANDS OFF RATHER THAN DUPLICATING ────────────────────────────────
 * A usable code resolves to the capability URL and navigates to
 * `/invite/[token]/create-account`, which already collects the details, takes assent, records
 * it before the claim and mints the JWT. Rebuilding that here would create a second
 * account-creation path — and therefore a second place for the assent gate to be
 * forgotten (Architecture v2.9 §19.10).
 *
 * ── THE DISCLOSURE IS A REAL BUTTON ─────────────────────────────────────────
 * `aria-expanded` on a `<button>`, not a `<details>` styled to look like one and not a
 * div with a click handler. Someone arriving by keyboard has to be able to find the
 * second option, and R47 says no route in this zone is a dead end.
 */
export function InviteCodeDisclosure() {
  const { redeem, submitting, error, clearError } = useSignUp();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const uid = useId();
  const panelId = `${uid}-invite-panel`;

  return (
    <section className="auth-disclosure">
      <button
        type="button"
        className="auth-disclosure__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="auth-disclosure__chevron" aria-hidden="true" data-open={open ? 'true' : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
        {AUTH_COPY.signUp.codeDisclosure}
      </button>

      <div id={panelId} className="auth-disclosure__panel" hidden={!open}>
        <InviteCodeField
          value={code}
          error={error}
          onChange={(v) => {
            setCode(v);
            if (error) clearError();
          }}
          onSubmitKey={() => void redeem(code)}
        />
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => void redeem(code)}
          disabled={submitting || code.trim().length === 0}
        >
          {submitting ? AUTH_COPY.signUp.codeChecking : AUTH_COPY.signUp.codeSubmit}
        </Button>
      </div>
    </section>
  );
}
