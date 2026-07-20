'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SequenceRegistry } from '@/lib/realtime/sequence';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import { useTranscriptStore } from '@/store/transcriptStore';
import type { Turn } from '@/types/thread.types';

/**
 * Subscribe a thread to streamed assistant turns.
 *
 * The contract, in order (Architecture v2.6 §19.8):
 *
 *   message.delta        provisional text, applied only in sequence
 *   message.under_review provisional text REPLACED by the approved wording
 *   message.halted       provisional text DISCARDED, honest notice shown
 *   message.final        the settled turn replaces everything provisional
 *
 * Three rules this hook enforces so the transcript can never be wrong:
 *
 *   · A GAP triggers a re-fetch, never an interpolation. Guessing at missing
 *     tokens is how an unapproved fragment reaches a screen.
 *   · Provisional text is ALWAYS replaceable. It is written into the store with
 *     status 'streaming' and is never treated as delivered.
 *   · The frontend cannot display an unapproved final message. Only
 *     `message.final` produces status 'settled'.
 *
 * With NEXT_PUBLIC_ENABLE_STREAMING_TURNS off, no socket is opened and turns
 * settle through the POST response exactly as they did in Phase 1.
 */
export interface UseStreamingTurnResult {
  /** True while a turn is actively streaming into this thread. */
  streaming: boolean;
  connected: boolean;
  /** Cancel the in-flight turn. Phase 2 sends turn.cancel; the server decides. */
  cancel: () => void;
}

export function useStreamingTurn(
  threadId: string | null,
  onGap?: (messageId: string) => void,
): UseStreamingTurnResult {
  const append = useTranscriptStore((s) => s.append);
  const update = useTranscriptStore((s) => s.update);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const registry = useMemo(() => new SequenceRegistry(), []);

  /* The callback is held in a ref so a re-render does not tear down the socket.
     It is written in an effect rather than during render — mutating a ref while
     rendering is the thing that makes concurrent rendering unsafe. */
  const gapRef = useRef(onGap);
  useEffect(() => {
    gapRef.current = onGap;
  }, [onGap]);

  const enabled =
    siteConfig.featureFlags.streamingTurns &&
    siteConfig.featureFlags.realtime &&
    Boolean(threadId);

  /** Write provisional text without ever marking it delivered. */
  const writeProvisional = useCallback(
    (messageId: string, text: string, seq: number) => {
      if (!threadId) return;
      const existing = useTranscriptStore.getState().turnsByThread[threadId] ?? [];
      const known = existing.some((t) => t.id === messageId);

      if (known) {
        update(threadId, messageId, { body: text, status: 'streaming' });
        return;
      }

      const turn: Turn = {
        id: messageId,
        threadId,
        role: 'itrix',
        body: text,
        seq,
        status: 'streaming',
        createdAt: new Date().toISOString(),
      };
      append(threadId, turn);
    },
    [threadId, append, update],
  );

  const { status, send } = useSocket({
    url: threadId ? wsUrls.review(threadId) : null,
    enabled,
    handlers: {
      'message.delta': (p) => {
        if (!threadId) return;
        const outcome = registry.apply(p.messageId, p.seq, p.delta);

        if (outcome.kind === 'stale') return;

        if (outcome.kind === 'gap') {
          /* Do not render a hole and do not guess. Drop what we have and ask
             the server for the message. */
          registry.release(p.messageId);
          setActiveMessageId(null);
          gapRef.current?.(p.messageId);
          return;
        }

        setActiveMessageId(p.messageId);
        writeProvisional(p.messageId, outcome.text, outcome.seq);
      },

      'message.final': (p) => {
        if (!threadId) return;
        registry.release(p.message.id);
        setActiveMessageId(null);

        const existing = useTranscriptStore.getState().turnsByThread[threadId] ?? [];
        const known = existing.find((t) => t.id === p.message.id);

        if (known) {
          update(threadId, p.message.id, { body: p.message.body, status: 'settled' });
          return;
        }

        /* A settled turn we never saw stream — the socket connected late, or the
           whole turn was short enough to arrive in one piece. It goes at the end
           of the thread's sequence rather than at an arbitrary index. */
        const nextSeq = existing.reduce((max, t) => Math.max(max, t.seq), 0) + 1;
        append(threadId, {
          id: p.message.id,
          threadId,
          role: 'itrix',
          body: p.message.body,
          seq: nextSeq,
          status: 'settled',
          createdAt: p.message.createdAt ?? new Date().toISOString(),
        });
      },

      'message.under_review': (p) => {
        if (!threadId) return;
        /* The provisional text is REPLACED, not annotated. The component reads
           the status and renders the approved wording instead of the body. */
        registry.release(p.messageId);
        setActiveMessageId(null);
        update(threadId, p.messageId, { body: '', status: 'under_review' });
      },

      'message.halted': (p) => {
        if (!threadId) return;
        /* Discard. Partial text that tripped the guard is exactly what must not
           be read, so it is not kept for context either. */
        registry.release(p.messageId);
        setActiveMessageId(null);
        update(threadId, p.messageId, { body: '', status: 'halted' });
      },
    },
  });

  useEffect(() => {
    return () => registry.clear();
  }, [registry, threadId]);

  const cancel = useCallback(() => {
    if (!threadId || !activeMessageId) return;
    send({ type: 'turn.cancel', payload: { threadId, messageId: activeMessageId } });
  }, [send, threadId, activeMessageId]);

  return {
    streaming: activeMessageId !== null,
    connected: status === 'open',
    cancel,
  };
}
