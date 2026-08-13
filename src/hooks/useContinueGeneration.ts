'use client';

import { useCallback, useState } from 'react';
import { turnsApi } from '@/lib/api/turnsApi';
import { usePendingStore } from '@/store/pendingStore';
import { useThreadStore } from '@/store/threadStore';
import { useTranscriptStore } from '@/store/transcriptStore';
import type { Turn } from '@/types/thread.types';

const CONTINUE_PROMPT = 'Continue from exactly where you stopped.';

function localId(): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `turn_continue_local_${rand}`;
}

/** One-click continuation for a turn the backend explicitly marked as truncated. */
export function useContinueGeneration(turn: Turn) {
  const [continuing, setContinuing] = useState(false);
  const append = useTranscriptStore((s) => s.append);
  const update = useTranscriptStore((s) => s.update);
  const upsertThread = useThreadStore((s) => s.upsert);
  const beginPending = usePendingStore((s) => s.begin);
  const endPending = usePendingStore((s) => s.end);

  const continueGeneration = useCallback(async () => {
    if (continuing || !turn.canContinue || !turn.threadId) return;

    const threadId = turn.threadId;
    const turns = useTranscriptStore.getState().turnsByThread[threadId] ?? [];
    const seq = turns.reduce((max, item) => Math.max(max, item.seq), 0) + 1;
    const optimisticId = localId();

    setContinuing(true);
    // Prevent a double-click from creating two continuations before the request returns.
    update(threadId, turn.id, { canContinue: false });
    append(threadId, {
      id: optimisticId,
      threadId,
      role: 'visitor',
      body: CONTINUE_PROMPT,
      seq,
      status: 'pending',
      createdAt: new Date().toISOString(),
      attachments: [],
    });
    beginPending(threadId);

    try {
      const result = await turnsApi.submit(threadId, { body: CONTINUE_PROMPT, attachmentIds: [] });
      if (!result.data) {
        update(threadId, optimisticId, {
          status: 'unavailable',
          contextNote: 'We could not continue the response just now. Please try again.',
        });
        // The original answer remains eligible for another attempt.
        update(threadId, turn.id, { canContinue: true });
        return;
      }

      update(threadId, optimisticId, {
        ...result.data.visitorTurn,
        id: optimisticId,
        body: CONTINUE_PROMPT,
        status: 'settled',
      });
      if (result.data.itrixTurn) append(threadId, result.data.itrixTurn);
      upsertThread(result.data.thread);
    } finally {
      endPending(threadId);
      setContinuing(false);
    }
  }, [append, beginPending, continuing, endPending, turn, update, upsertThread]);

  return { continueGeneration, continuing };
}
