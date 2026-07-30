'use client';

import { useEffect } from 'react';
import { usePendingStore } from '@/store/pendingStore';
import { PENDING_TIMEOUT_MS } from '@/lib/content/pendingCopy';
import type { PendingTurn } from '@/store/pendingStore';

/**
 * Whether a turn is waiting on itriX, and which stage it reports.
 *
 * ── THE LABEL ADVANCES ONLY ON A REAL EVENT (R42) ───────────────────────────
 * The stage comes from the backend's `message.stage`, emitted at the three real
 * pipeline transitions — retrieval starts, generation starts, the settle pipeline
 * starts (Backend v7.0 §5). It is never emitted on a timer, and if a stage cannot
 * be determined the backend sends nothing and the indicator HOLDS rather than
 * advancing.
 *
 * That is the whole design. A progress display that moves on its own looks better
 * for one turn and costs the visitor's trust in every statement the surface makes
 * afterwards.
 *
 * ── THE ONE TIME-BASED BEHAVIOUR, AND WHY IT IS HONEST ──────────────────────
 * After PENDING_TIMEOUT_MS with neither a delta nor a stage event, the indicator
 * says "this is taking longer than usual" and offers a retry. That reports a fact
 * about elapsed time; it does not claim anything about what the backend is doing.
 * Without it, a dropped socket leaves a visitor watching an animation forever.
 *
 * The store is written by `useComposer` (a wait begins) and by `useStreamingTurn`
 * (a delta, a settle, a halt or a review ends it).
 */
export interface UsePendingStageResult {
  pending: PendingTurn | null;
  waiting: boolean;
  slow: boolean;
}

export function usePendingStage(threadId: string | null): UsePendingStageResult {
  const byThread = usePendingStore((s) => s.byThread);
  const markSlow = usePendingStore((s) => s.markSlow);

  const pending = threadId ? byThread[threadId] ?? null : null;
  const startedAt = pending?.startedAt ?? null;
  const alreadySlow = pending?.slow ?? false;

  useEffect(() => {
    if (!threadId || startedAt === null || alreadySlow) return;
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, PENDING_TIMEOUT_MS - elapsed);
    const timer = setTimeout(() => markSlow(threadId), remaining);
    return () => clearTimeout(timer);
  }, [threadId, startedAt, alreadySlow, markSlow]);

  return { pending, waiting: pending !== null, slow: alreadySlow };
}
