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
 * The /c/[token] page renders INSTANTLY from the server-fetched payload, then upgrades to
 * the AI version WITHOUT a manual reload:
 *
 *  • Realtime ON: it opens the client-page WebSocket. `clientpage.delta` streams the
 *    "what we heard" narrative token-by-token (visible generation, like Claude), and
 *    `clientpage.final` swaps in the fully-assembled AI page.
 *
 *  • NEVER-HANG GUARANTEE (v4.0.7): if the socket doesn't deliver a delta/final within
 *    STREAM_TIMEOUT_MS (dropped, no data, frame drift), we start polling the REST endpoint
 *    until the AI-enriched page lands — so the visitor ALWAYS ends up on the AI version on
 *    first visit, reload-free, whether or not streaming works. If realtime is off we poll
 *    from the start.
 */
const POLL_MS = 2500;
const MAX_WAIT_MS = 90000;
const STREAM_TIMEOUT_MS = 5000;

export function ClientPageLive({ token, initialPage }: { token: string; initialPage: ClientPage }) {
  const [page, setPage] = useState<ClientPage>(initialPage);
  const [streamingMirror, setStreamingMirror] = useState<string | null>(null);
  const doneRef = useRef<boolean>(initialPage.usedAi === true);
  const startedAt = useRef<number>(Date.now());
  const gotStreamRef = useRef<boolean>(false);
  // Toggles the polling effect on when streaming didn't start in time.
  const [pollFallback, setPollFallback] = useState<boolean>(false);

  const realtime = siteConfig.featureFlags.realtime;

  // ── Live path: stream generation over the WebSocket ──────────────────────
  const { connected, send } = useSocket({
    url: realtime && !doneRef.current ? wsUrls.clientPage(token) : null,
    token,
    enabled: realtime && !doneRef.current,
    handlers: {
      'clientpage.delta': (p: ClientPageDeltaPayload) => {
        gotStreamRef.current = true;
        if (p.field === 'problemMirror') {
          setStreamingMirror((prev) => (prev ?? '') + p.delta);
        }
      },
      'clientpage.final': (p: ClientPageFinalPayload) => {
        gotStreamRef.current = true;
        if (p.page) {
          doneRef.current = true;
          setStreamingMirror(null);
          setPage(p.page);
        }
      },
    },
  });

  // Ask the server to stream this page once, when the socket opens; arm a fallback timer.
  const subscribedRef = useRef(false);
  useEffect(() => {
    if (!realtime || doneRef.current) return;
    if (connected && !subscribedRef.current) {
      subscribedRef.current = true;
      send({ type: 'subscribe', payload: { channel: 'clientpage' } });
    }
    // If nothing streams back in time, switch to polling so the AI page still lands.
    const t = setTimeout(() => {
      if (!gotStreamRef.current && !doneRef.current) {
        setPollFallback(true);
      }
    }, STREAM_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [connected, send, realtime]);

  // ── Fallback path: poll when realtime is off OR the stream didn't start ───
  useEffect(() => {
    const shouldPoll = !realtime || pollFallback;
    if (!shouldPoll || doneRef.current) return;

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
          setStreamingMirror(null);
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
  }, [token, realtime, pollFallback]);

  const displayPage: ClientPage =
    streamingMirror != null ? { ...page, problemMirror: streamingMirror } : page;

  return <ClientPageShell page={displayPage} />;
}
