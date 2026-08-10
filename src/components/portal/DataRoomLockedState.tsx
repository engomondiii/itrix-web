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
const FALLBACK_CONFIRMATION =
  'Thank you — we have your request. The itriX team will prepare your NDA and send it to ' +
  'the address on your account. Keep an eye on your workspace inbox and your email; you do ' +
  'not need to do anything until it arrives.';

export function DataRoomLockedState() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
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
    /* An honest failure: nothing was requested, so we do not say it was. */
    setMessage(res.error ?? 'We could not send that request just now. Please try again.');
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
      ) : (
        <>
          <div className="flex items-center gap-3 pt-1">
            <Button variant="gold" size="md" onClick={() => void submit()} disabled={state === 'sending'}>
              {PORTAL_COPY.documents.dataRoomLocked.button}
            </Button>
            {state === 'sending' ? <Spinner size="sm" /> : null}
          </div>
          {state === 'error' ? <p className="text-secondary text-error-text">{message}</p> : null}
        </>
      )}
    </Card>
  );
}
