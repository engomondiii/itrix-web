'use client';

import { WsClient } from './wsClient';
import type { WsStatus } from './wsClient';
import type { ServerEvent, ServerEventHandlers, ClientEvent } from './socketEvents';

/**
 * ONE SOCKET PER URL, SHARED BY EVERY SUBSCRIBER.
 *
 * ── WHAT THIS FIXES ─────────────────────────────────────────────────────────
 * Six hooks each opened their OWN connection to the same review URL:
 *
 *     useStreamingTurn · useThreadList · useAttachments
 *     useClientPageReveal · useSuggestions · useArtifacts
 *
 * `useSocket` did `new WsClient(...)` in an effect, so one open thread meant six
 * live WebSockets to one endpoint, six handshakes, six reconnect ladders, and six
 * copies of every server frame arriving in the browser. That is the duplication
 * seen in the console, and it is also why a mounted-twice consumer could append
 * the same turn twice: each connection delivered the same `message.final`.
 *
 * It was six times the server-side channel-layer fan-out too, for one visitor.
 *
 * ── HOW IT WORKS ────────────────────────────────────────────────────────────
 * Connections are kept in a module-level registry keyed by `url|token`. The first
 * subscriber opens the socket; later ones attach to it. Each frame is dispatched
 * to every subscriber that registered a handler for that event type, so no hook
 * loses an event it used to receive. The last subscriber to leave closes it.
 *
 * ── WHY CLOSING IS DEFERRED ─────────────────────────────────────────────────
 * React's development remount, and any navigation that swaps which component owns
 * a hook, unsubscribes before it re-subscribes. Closing synchronously would tear
 * down a healthy connection and immediately rebuild it — a reconnect storm on
 * every render pass. A short grace period lets the new subscriber claim the live
 * socket instead.
 */

/** How long a socket with no subscribers is kept alive before closing. */
const IDLE_GRACE_MS = 250;

type Subscriber = {
  handlers: () => ServerEventHandlers;
  onStatus: (status: WsStatus) => void;
};

interface Entry {
  client: WsClient;
  status: WsStatus;
  subscribers: Set<Subscriber>;
  closeTimer: ReturnType<typeof setTimeout> | null;
}

const REGISTRY = new Map<string, Entry>();

function keyFor(url: string, token?: string | null): string {
  return `${url}|${token ?? ''}`;
}

export interface SocketHandle {
  send: (event: ClientEvent) => void;
  /** Current status at the moment of subscribing, so a late joiner is not stuck on 'idle'. */
  status: WsStatus;
  unsubscribe: () => void;
}

export function subscribeShared(
  url: string,
  token: string | null | undefined,
  sub: Subscriber,
): SocketHandle {
  const key = keyFor(url, token);
  let entry = REGISTRY.get(key);

  if (!entry) {
    const created: Entry = {
      // Assigned immediately below; the callbacks close over `created`.
      client: null as unknown as WsClient,
      status: 'idle',
      subscribers: new Set<Subscriber>(),
      closeTimer: null,
    };

    created.client = new WsClient({
      url,
      token,
      onStatus: (status) => {
        created.status = status;
        for (const s of created.subscribers) s.onStatus(status);
      },
      onEvent: (event: ServerEvent) => {
        /* Copied before iterating: a handler may subscribe or unsubscribe, and
           mutating a Set while iterating it is how frames get skipped. */
        for (const s of [...created.subscribers]) {
          const handler = s.handlers()[event.type];
          // Each entry's payload type matches its key by construction of ServerEvent.
          if (handler) (handler as (p: ServerEvent['payload']) => void)(event.payload);
        }
      },
    });

    REGISTRY.set(key, created);
    entry = created;
    entry.client.connect();
  }

  /* Reclaimed before it could be torn down. */
  if (entry.closeTimer) {
    clearTimeout(entry.closeTimer);
    entry.closeTimer = null;
  }

  entry.subscribers.add(sub);
  const active = entry;

  return {
    status: active.status,
    send: (event: ClientEvent) => active.client.send(event),
    unsubscribe: () => {
      active.subscribers.delete(sub);
      if (active.subscribers.size > 0 || active.closeTimer) return;

      active.closeTimer = setTimeout(() => {
        active.closeTimer = null;
        /* Re-check: someone may have joined inside the grace period. */
        if (active.subscribers.size > 0) return;
        active.client.close();
        if (REGISTRY.get(key) === active) REGISTRY.delete(key);
      }, IDLE_GRACE_MS);
    },
  };
}

/** Test and teardown helper. Not used in the app. */
export function closeAllShared(): void {
  for (const [key, entry] of REGISTRY) {
    if (entry.closeTimer) clearTimeout(entry.closeTimer);
    entry.client.close();
    REGISTRY.delete(key);
  }
}

/** How many sockets are open. Used by the test that pins the fix. */
export function sharedSocketCount(): number {
  return REGISTRY.size;
}
