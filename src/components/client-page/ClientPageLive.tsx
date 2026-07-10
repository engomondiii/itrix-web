'use client';

import { useEffect, useRef, useState } from 'react';
import { ClientPageShell } from './ClientPageShell';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import type { ClientPage } from '@/types/client.types';
import type { ClientPageDeltaPayload, ClientPageFinalPayload } from '@/lib/realtime/socketEvents';

/**
 * Live-updating wrapper around ClientPageShell.
 *
 * The /c/[token] page renders INSTANTLY from the server-fetched payload. Then:
 *
 *  • Realtime ON (default in production): it opens the client-page WebSocket and watches
 *    the page GENERATE in real time — `clientpage.delta` streams the "what we heard"
 *    narrative token-by-token (so the visitor sees it being written, like Claude), and
 *    `clientpage.final` swaps in the fully-assembled AI page the moment it's ready. No
 *    reload, no waiting on a blank swap.
 *
 *  • Realtime OFF / socket unavailable: it silently polls /api/client-page/{token} until
 *    the AI-enriched version lands (the previous behavior), then stops. If nothing richer
 *    ever arrives, the deterministic page remains (fully valid, claim-safe).
 */
const POLL_MS = 3000;
const MAX_WAIT_MS = 90000;

export function ClientPageLive({ token, initialPage }: { token: string; initialPage: ClientPage }) {
  const [page, setPage] = useState<ClientPage>(initialPage);
  // A live-streaming narrative buffer; while non-null it overrides page.problemMirror.
  const [streamingMirror, setStreamingMirror] = useState<string | null>(null);
  const doneRef = useRef<boolean>(initialPage.usedAi === true);
  const startedAt = useRef<number>(Date.now());

  const realtime = siteConfig.featureFlags.realtime;

  // ── Live path: stream generation over the WebSocket ──────────────────────
  const { connected, send } = useSocket({
    url: realtime && !doneRef.current ? wsUrls.clientPage(token) : null,
    token,
    enabled: realtime && !doneRef.current,
    handlers: {
      'clientpage.delta': (p: ClientPageDeltaPayload) => {
        if (p.field === 'problemMirror') {
          setStreamingMirror((prev) => (prev ?? '') + p.delta);
        }
      },
      'clientpage.final': (p: ClientPageFinalPayload) => {
        if (p.page) {
          doneRef.current = true;
          setStreamingMirror(null);
          setPage(p.page);
        }
      },
    },
  });

  // Ask the server to stream this page exactly once, when the socket opens.
  const subscribedRef = useRef(false);
  useEffect(() => {
    if (connected && !subscribedRef.current && !doneRef.current) {
      subscribedRef.current = true;
      send({ type: 'subscribe', payload: { channel: 'clientpage' } });
    }
  }, [connected, send]);

  // ── Fallback path: poll only when realtime is off ────────────────────────
  useEffect(() => {
    if (doneRef.current || realtime) return; // realtime path handles it otherwise

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
        if (!res.ok) return;
        const next = (await res.json()) as ClientPage;
        if (cancelled) return;
        if (next && next.usedAi === true) {
          doneRef.current = true;
          setPage(next);
          stop();
        }
      } catch {
        /* transient — retry on next tick */
      }
    }

    timer = setInterval(() => void poll(), POLL_MS);
    void poll();
    return () => {
      cancelled = true;
      stop();
    };
  }, [token, realtime]);

  // While the narrative is streaming, show it live in place of the static mirror.
  const displayPage: ClientPage =
    streamingMirror != null ? { ...page, problemMirror: streamingMirror } : page;

  return <ClientPageShell page={displayPage} />;
}
