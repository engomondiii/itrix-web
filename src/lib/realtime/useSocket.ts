'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribeShared } from './sharedSocket';
import type { SocketHandle } from './sharedSocket';
import type { WsStatus } from './wsClient';
import type { ServerEventHandlers, ClientEvent } from './socketEvents';

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
  const handleRef = useRef<SocketHandle | null>(null);
  const handlersRef = useRef<ServerEventHandlers>(handlers);
  handlersRef.current = handlers;

  /*
   * SUBSCRIBES TO A SHARED CONNECTION rather than opening one.
   *
   * Six hooks call this with the same review URL (streaming turns, the thread
   * list, attachments, the client-page reveal, suggestions, artifacts). Opening a
   * WebSocket per hook meant six connections, six reconnect ladders and six copies
   * of every frame for one visitor — the duplication visible in the console. The
   * registry in ./sharedSocket keeps one connection per URL and fans each frame
   * out to whichever subscribers registered a handler for it, so no hook loses an
   * event and none of them can double-deliver one.
   */
  useEffect(() => {
    if (!enabled || !url) {
      setStatus('idle');
      return;
    }

    const handle = subscribeShared(url, token, {
      handlers: () => handlersRef.current,
      onStatus: setStatus,
    });
    handleRef.current = handle;
    /* A late joiner attaching to an already-open socket would otherwise sit on
       'idle' until the next status change, which for a healthy connection never
       comes. */
    setStatus(handle.status);

    return () => {
      handle.unsubscribe();
      handleRef.current = null;
    };
  }, [url, token, enabled]);

  const send = useCallback((event: ClientEvent) => {
    handleRef.current?.send(event);
  }, []);

  return { status, connected: status === 'open', send };
}
