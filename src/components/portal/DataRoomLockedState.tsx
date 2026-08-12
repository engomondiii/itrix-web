'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Spinner } from '@/components/ui/Spinner';
import { portalApi } from '@/lib/api/portalApi';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * The NDA-gated data room in its LOCKED state (§65). Framed as a normal,
 * trust-building step — not a wall.
 *
 * ── SUBMITS IN PLACE (2026-08-10) ───────────────────────────────────────────
 * "Arrange an NDA" used to be a LINK into Messages, so pressing it navigated the
 * customer out of the room they were trying to open and left them to compose the
 * request themselves. It now posts the request and answers here, in place.
 *
 * The confirmation sentence comes from the BACKEND response, which is the same
 * string it posts into the customer's inbox — the screen and the inbox cannot
 * promise different things. The fallback below is used only if the response
 * carries no message, and says the same in the same terms.
 *
 * The room does NOT unlock on submission, and the copy does not imply it will: a
 * request is not a signature. It opens when the signed NDA is in place, which the
 * live `nda.signed` event and the next fetch both already handle.
 */
/* ── THE PREPARING STATE (fix, 2026-08-12) ──────────────────────────────────
   Reported symptom: pressing "Arrange an NDA" on the workspace Documents screen showed
   an error. Two separate things were wrong, and only one of them was the request.

   (1) The button reported EVERY non-2xx as a red failure line, including the two cases
       that are not failures at all: a 401 when the client session has quietly expired,
       and a slow first request against a cold Railway container. Both read as "we hit a
       problem" to somebody who had just asked for a legal document.

   (2) There was no "we are working on it" state at all — only a spinner beside the
       button, which on mobile portrait sits below the fold. Pressing a button and
       seeing nothing change is indistinguishable from a broken button, so people press
       it again.

   So: an explicit PREPARING panel replaces the button the moment it is pressed, a 401
   is handled as "sign in again" rather than an error, and the only thing still rendered
   in red is a genuine failure — where nothing was sent and saying so is the honest
   outcome. */
const PREPARING =
  'Hold on — we are putting your NDA request through to the itriX team now.';

const SESSION_EXPIRED =
  'Your session has timed out. Please sign in again and press this once more — nothing ' +
  'has been sent yet.';

const FALLBACK_CONFIRMATION =
  'Thank you — we have your request. The itriX team will prepare your NDA and send it to ' +
  'the address on your account. Keep an eye on your workspace inbox and your email; you do ' +
  'not need to do anything until it arrives.';

export function DataRoomLockedState() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'expired' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit() {
    if (state === 'sending' || state === 'done') return;
    setState('sending');
    const res = await portalApi.requestNda();
    if (res.data) {
      trackEvent('portal.nda_requested', {});
      setMessage(res.data.message || res.data.detail || FALLBACK_CONFIRMATION);
      setState('done');
      return;
    }
    /* A timed-out session is not a fault the customer caused and not a fault of ours.
       Told apart from a real failure because the remedy is completely different: sign
       in and press again, versus try again later. */
    if ((res.error ?? '').includes('401')) {
      setMessage(SESSION_EXPIRED);
      setState('expired');
      return;
    }
    /* An honest failure: nothing was requested, so we do not say it was. The proxy's
       own string ("/api/portal/nda-request 502") is never shown — it tells the
       customer nothing and looks like a crash. */
    setMessage('We could not send that request just now. Please try again in a moment.');
    setState('error');
  }

  return (
    <Card variant="warm" className="flex flex-col gap-3">
      <SectionLabel tone="gold">{PORTAL_COPY.documents.dataRoomLocked.heading}</SectionLabel>
      <p className="reading text-ink-secondary">{PORTAL_COPY.documents.dataRoomLocked.body}</p>

      {state === 'done' ? (
        <div
          role="status"
          className="rounded-md border border-border-soft bg-surface px-4 py-3 text-secondary text-ink-primary"
        >
          {message}
        </div>
      ) : state === 'sending' ? (
        /* Replaces the button rather than sitting beside it, so on a phone in portrait
           the state IS what you are looking at. aria-live so it is announced, and
           aria-busy so assistive tech reports work in progress rather than a result. */
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="flex items-center gap-3 rounded-md border border-border-soft bg-surface px-4 py-3 text-secondary text-ink-primary"
        >
          <Spinner size="sm" />
          <span>{PREPARING}</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 pt-1">
            <Button variant="gold" size="md" onClick={() => void submit()}>
              {PORTAL_COPY.documents.dataRoomLocked.button}
            </Button>
          </div>
          {state === 'expired' ? (
            <p role="status" className="text-secondary text-ink-secondary">
              {message}
            </p>
          ) : null}
          {state === 'error' ? <p className="text-secondary text-error-text">{message}</p> : null}
        </>
      )}
    </Card>
  );
}
