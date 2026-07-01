/**
 * Authenticated WebSocket client (Phase 3 §12).
 *
 * Auth model: the access token is passed in the WS subprotocol (Sec-WebSocket-Protocol),
 * NOT the query string — query strings leak into logs. For the anonymous review /
 * client-page sockets the "token" is the capability token; for the portal socket the
 * page has already authenticated via the httpOnly cookie and the server upgrades the
 * connection, so no token is needed in-band there.
 *
 * Responsibilities: connect, JSON encode/decode, heartbeat ping, and reconnect with
 * backoff (resume on drop). It is transport only — it knows nothing about journeys or
 * chat; consumers subscribe to typed events.
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
      if (parsed && typeof parsed.type === 'string') this.opts.onEvent(parsed);
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
    this.setStatus('closed');
  }
}
