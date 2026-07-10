'use client';

import { useEffect, useRef, useState } from 'react';
import { ClientPageShell } from './ClientPageShell';
import { ClientPagePreparing } from './ClientPagePreparing';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import type { ClientPage } from '@/types/client.types';
import type { ClientPageFinalPayload } from '@/lib/realtime/socketEvents';

/**
 * Gate the customized client page on the AI being ready.
 *
 * Chosen UX (v4.0.8): rather than flashing the deterministic stub and then reloading to
 * the AI version, we HOLD on a "preparing your review" loading state and reveal the
 * finished page ONCE the AI-enriched version is ready — no reload, no flip.
 *
 *   • If the server payload is already AI-enriched (usedAi === true) → show it now.
 *   • Otherwise show ClientPagePreparing and wait for the AI page:
 *       – a WebSocket clientpage.final delivers it the instant it's built (fast path), and
 *       – in parallel we poll /api/client-page/{token} until usedAi === true (reliable
 *         path that works even if the socket never streams).
 *   • Safety timeout (MAX_WAIT_MS): if the AI never completes, reveal whatever content we
 *     have (the deterministic page is valid + claim-safe) so we NEVER spin forever.
 */
const POLL_MS = 2500;
const MAX_WAIT_MS = 90000;

export function ClientPageLive({ token, initialPage }: { token: string; initialPage: ClientPage }) {
  // The page we'll ultimately show. Start from the server payload (used as the safety
  // fallback), but only REVEAL it once ready=true.
  const [page, setPage] = useState<ClientPage>(initialPage);
  const [ready, setReady] = useState<boolean>(initialPage.usedAi === true);
  const doneRef = useRef<boolean>(initialPage.usedAi === true);
  const startedAt = useRef<number>(Date.now());

  const realtime = siteConfig.featureFlags.realtime;

  // ── Fast path: WebSocket delivers the finished AI page the moment it's built ──
  const { connected, send } = useSocket({
    url: realtime && !doneRef.current ? wsUrls.clientPage(token) : null,
    token,
    enabled: realtime && !doneRef.current,
    handlers: {
      'clientpage.final': (p: ClientPageFinalPayload) => {
        if (p.page && p.page.usedAi === true) {
          doneRef.current = true;
          setPage(p.page);
          setReady(true);
        }
      },
    },
  });

  const subscribedRef = useRef(false);
  useEffect(() => {
    if (!realtime || doneRef.current) return;
    if (connected && !subscribedRef.current) {
      subscribedRef.current = true;
      send({ type: 'subscribe', payload: { channel: 'clientpage' } });
    }
  }, [connected, send, realtime]);

  // ── Reliable path: poll until the AI-enriched page lands (works with or without WS) ──
  useEffect(() => {
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

      // Safety: after the max wait, reveal whatever we have so we never hang.
      if (Date.now() - startedAt.current > MAX_WAIT_MS) {
        doneRef.current = true;
        setReady(true);
        stop();
        return;
      }

      try {
        const res = await fetch(`/api/client-page/${encodeURIComponent(token)}`, {
          method: 'GET',
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return;
        const next = (await res.json()) as ClientPage;
        if (cancelled) return;
        if (next && next.usedAi === true) {
          doneRef.current = true;
          setPage(next);
          setReady(true);
          stop();
        }
      } catch {
        /* transient — retry on next tick */
      }
    }

    timer = setInterval(() => void poll(), POLL_MS);
    void poll(); // fire immediately (covers the case where AI finished during page load)
    return () => {
      cancelled = true;
      stop();
    };
  }, [token]);

  if (!ready) {
    return <ClientPagePreparing />;
  }

  return <ClientPageShell page={page} />;
}
