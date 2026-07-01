'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { WsClient } from './wsClient';
import type { WsStatus } from './wsClient';
import type { ServerEvent, ServerEventHandlers, ClientEvent } from './socketEvents';

interface UseSocketArgs {
  /** Absolute ws:// or wss:// URL. When null, the socket stays idle (flag off). */
  url: string | null;
  token?: string | null;
  handlers: ServerEventHandlers;
  /** Gate connection on a feature flag; when false, no socket is opened. */
  enabled: boolean;
}

/**
 * Low-level socket hook: connect / subscribe / send, with typed event dispatch.
 * Handlers are kept in a ref so re-renders don't tear down the connection. When
 * `enabled` is false or `url` is null (realtime flag off), it is a no-op and callers
 * fall back to polling — the public shape is identical either way.
 */
export function useSocket({ url, token, handlers, enabled }: UseSocketArgs) {
  const [status, setStatus] = useState<WsStatus>('idle');
  const clientRef = useRef<WsClient | null>(null);
  const handlersRef = useRef<ServerEventHandlers>(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!enabled || !url) {
      setStatus('idle');
      return;
    }

    const client = new WsClient({
      url,
      token,
      onStatus: setStatus,
      onEvent: (event: ServerEvent) => {
        const handler = handlersRef.current[event.type];
        // Each entry's payload type matches its key by construction of ServerEvent.
        if (handler) (handler as (p: ServerEvent['payload']) => void)(event.payload);
      },
    });
    clientRef.current = client;
    client.connect();

    return () => {
      client.close();
      clientRef.current = null;
    };
  }, [url, token, enabled]);

  const send = useCallback((event: ClientEvent) => {
    clientRef.current?.send(event);
  }, []);

  return { status, connected: status === 'open', send };
}
