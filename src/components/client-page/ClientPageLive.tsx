'use client';

import { useEffect, useRef, useState } from 'react';
import { ClientPageShell } from './ClientPageShell';
import type { ClientPage } from '@/types/client.types';

/**
 * Auto-updating wrapper around ClientPageShell.
 *
 * The /c/[token] page renders INSTANTLY from the server-fetched (possibly deterministic)
 * payload. The AI-enriched result page is built in the background on the server after
 * qualification; this wrapper quietly re-fetches /api/client-page/{token} and swaps in the
 * enriched version the moment it lands — no manual reload.
 *
 * Behaviour:
 *   • If the initial payload is already AI-enriched (usedAi === true), no polling starts.
 *   • Otherwise it polls every POLL_MS until usedAi flips true, then does ONE final swap
 *     and stops. It also stops after MAX_WAIT_MS so it never polls forever.
 *   • Polling is silent: the visible page never flickers or shows a spinner — it simply
 *     upgrades in place when richer content arrives. If polling never succeeds, the
 *     deterministic page remains (fully valid, claim-safe).
 */
const POLL_MS = 3000;
const MAX_WAIT_MS = 90000;

export function ClientPageLive({ token, initialPage }: { token: string; initialPage: ClientPage }) {
  const [page, setPage] = useState<ClientPage>(initialPage);
  const startedAt = useRef<number>(Date.now());
  const doneRef = useRef<boolean>(initialPage.usedAi === true);

  useEffect(() => {
    // Already enriched → nothing to do.
    if (doneRef.current) return;

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    async function poll() {
      if (cancelled || doneRef.current) return;

      // Give up quietly after the max wait — keep the deterministic page.
      if (Date.now() - startedAt.current > MAX_WAIT_MS) {
        doneRef.current = true;
        stop();
        return;
      }

      try {
        const res = await fetch(`/api/client-page/${encodeURIComponent(token)}`, {
          method: 'GET',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return; // transient; keep polling
        const next = (await res.json()) as ClientPage;
        if (cancelled) return;

        if (next && next.usedAi === true) {
          // Enriched version has landed — swap it in once and stop.
          doneRef.current = true;
          setPage(next);
          stop();
        }
      } catch {
        // Network hiccup — ignore and let the next tick retry.
      }
    }

    timer = setInterval(() => void poll(), POLL_MS);
    // Also fire one immediately (covers the case where enrichment finished during load).
    void poll();

    return () => {
      cancelled = true;
      stop();
    };
  }, [token]);

  return <ClientPageShell page={page} />;
}
