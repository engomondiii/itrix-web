'use client';

import { useEffect, useState } from 'react';
import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { SupportStatus } from '@/types/success.types';

/**
 * Support status and SLA.
 *
 * A breached SLA is stated as breached, in words, on the customer's screen. That
 * is uncomfortable and correct: a customer who can see we are late trusts the
 * times we say we will hit.
 *
 * The overdue check reads the clock, which is impure and cannot happen during
 * render — the server and the client would disagree and React would warn about
 * the mismatch. So the badge renders the promised time first and marks it
 * overdue after mount, which is also the honest order: the commitment is the
 * fact, and lateness is an observation about it.
 */
export function SlaBadge({ status, slaDueAt }: { status: SupportStatus; slaDueAt: string | null }) {
  const [breached, setBreached] = useState(false);

  useEffect(() => {
    if (!slaDueAt || status === 'resolved') return;
    const dueMs = new Date(slaDueAt).getTime();
    const check = () => setBreached(dueMs < Date.now());

    // The first check is deferred rather than synchronous. The clock is an
    // external system, and reading it during the effect body would make this a
    // render-time decision in all but name — with the server and the client
    // disagreeing about "now".
    const first = setTimeout(check, 0);
    // Re-check each minute so a badge left open turns over on its own.
    const id = setInterval(check, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [slaDueAt, status]);

  const due = slaDueAt ? new Date(slaDueAt) : null;

  return (
    <span className="flex flex-wrap items-center gap-2 font-mono text-micro uppercase tracking-[0.08em]">
      <span className={status === 'resolved' ? 'text-success' : 'text-ink-secondary'}>
        {SUCCESS_COPY.support.status[status]}
      </span>
      {due ? (
        <span className={breached ? 'text-error' : 'text-ink-muted'}>
          {breached ? 'Response overdue' : `Response by ${due.toLocaleString()}`}
        </span>
      ) : null}
    </span>
  );
}
