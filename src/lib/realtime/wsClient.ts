/**
 * Authenticated WebSocket client (Phase 3 §12).
 *
 * Auth model: the access token is passed in the WS subprotocol (Sec-WebSocket-Protocol),
 * NOT the query string — query strings leak into logs. For the anonymous review /
 * client-page sockets the "token" is the capability token; for the portal socket the
 * page has already authenticated via the httpOnly cookie and the server upgrades the
 * connection, so no token is needed in-band there.
 *
 * Responsibilities: connect, JSON encode/decode, heartbeat ping, reconnect with
 * backoff, and SEQUENCE TRACKING. It is transport only — it knows nothing about
 * journeys or conversations; consumers subscribe to typed events.
 *
 * v5.0 adds ordering (Architecture v2.6 §14.4). Every `message.delta` carries a
 * monotonic `seq` per message. Three behaviours follow, and they exist so a
 * streamed turn is never rendered wrong:
 *
 *   · An OUT-OF-ORDER delta (seq ≤ the last one seen) is dropped. Re-applying it
 *     would duplicate text the visitor is already reading.
 *   · A GAP (seq jumps by more than one) fires `onGap`. The consumer re-fetches
 *     the message rather than rendering a hole — guessing at the missing tokens
 *     is exactly how an unapproved fragment could reach the screen.
 *   · On RECONNECT the last acknowledged sequence per message is retained, so a
 *     resumed stream continues rather than restarting.
 */

import { Backoff } from './reconnect';
import type { ServerEvent, ClientEvent } from './socketEvents';

export type WsStatus = 'idle' | 'connecting' | 'open' | 'closed';

export interface WsClientOptions {
  url: string;
  /** Token placed in the WS subprotocol for authentication (optional for portal). */
  token?: string | null;
  onEvent: (event: ServerEvent) => void;
  onStatus?: (status: WsStatus) => void;
  /**
   * A delta arrived with a sequence gap. The consumer should re-fetch the
   * message; it must NOT interpolate the missing tokens.
   */
  onGap?: (messageId: string, expected: number, received: number) => void;
  heartbeatMs?: number;
}

const SUBPROTOCOL_PREFIX = 'itrix.bearer.';

export class WsClient {
  private ws: WebSocket | null = null;
  private readonly opts: WsClientOptions;
  private readonly backoff = new Backoff();
  private heartbeat: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closedByUs = false;
  private status: WsStatus = 'idle';
  /** Last acknowledged sequence per streaming message. Survives reconnects. */
  private readonly lastSeq = new Map<string, number>();

  constructor(opts: WsClientOptions) {
    this.opts = opts;
  }

  private setStatus(s: WsStatus) {
    this.status = s;
    this.opts.onStatus?.(s);
  }

  connect(): void {
    if (typeof window === 'undefined') return; // never on the server
    this.closedByUs = false;
    this.open();
  }

  private open(): void {
    this.setStatus('connecting');
    try {
      const protocols = this.opts.token ? [`${SUBPROTOCOL_PREFIX}${this.opts.token}`] : undefined;
      this.ws = new WebSocket(this.opts.url, protocols);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.backoff.reset();
      this.setStatus('open');
      this.startHeartbeat();
    };

    this.ws.onmessage = (ev: MessageEvent) => {
      let parsed: ServerEvent | null = null;
      try {
        parsed = JSON.parse(typeof ev.data === 'string' ? ev.data : '') as ServerEvent;
      } catch {
        parsed = null;
      }
      if (!parsed || typeof parsed.type !== 'string') return;

      /* Ordering is enforced here rather than in every consumer, so a component
         can never accidentally render an out-of-order fragment. */
      if (parsed.type === 'message.delta') {
        const { messageId, seq } = parsed.payload;
        if (typeof seq === 'number') {
          const previous = this.lastSeq.get(messageId);
          if (previous !== undefined) {
            if (seq <= previous) return;                    // stale or duplicate
            if (seq > previous + 1) {
              this.opts.onGap?.(messageId, previous + 1, seq);
              return;                                       // re-fetch, never guess
            }
          }
          this.lastSeq.set(messageId, seq);
        }
      }

      /* A settled message needs no further ordering state. */
      if (parsed.type === 'message.final') {
        this.lastSeq.delete(parsed.payload.message.id);
      }
      if (parsed.type === 'message.halted') {
        this.lastSeq.delete(parsed.payload.messageId);
      }

      this.opts.onEvent(parsed);
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.setStatus('closed');
      if (!this.closedByUs) this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      // onclose will follow; let it handle reconnection.
      try {
        this.ws?.close();
      } catch {
        /* noop */
      }
    };
  }

  private scheduleReconnect(): void {
    if (this.closedByUs) return;
    const delay = this.backoff.next();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.open(), delay);
  }

  private startHeartbeat(): void {
    const interval = this.opts.heartbeatMs ?? 25000;
    this.stopHeartbeat();
    this.heartbeat = setInterval(() => this.send({ type: 'ping', payload: {} }), interval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.heartbeat = null;
  }

  send(event: ClientEvent): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }

  getStatus(): WsStatus {
    return this.status;
  }

  close(): void {
    this.closedByUs = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    try {
      this.ws?.close();
    } catch {
      /* noop */
    }
    this.ws = null;
    /* A deliberate close ends the conversation's stream state. A DROP does not:
       scheduleReconnect leaves the map intact so a resumed stream continues from
       the last acknowledged sequence rather than restarting. */
    this.lastSeq.clear();
    this.setStatus('closed');
  }
}
