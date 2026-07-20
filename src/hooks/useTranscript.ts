'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { threadsApi } from '@/lib/api/threadsApi';
import { useTranscriptStore, hasGap } from '@/store/transcriptStore';
import { useArtifacts } from '@/hooks/useArtifacts';
import type { Turn } from '@/types/thread.types';
import type { Artifact, InlineCard } from '@/types/artifact.types';

/**
 * The ordered contents of one thread: turns, artifacts and inline cards.
 *
 * PHASE 2 MERGES THREE STREAMS INTO ONE LIST. They share the thread's sequence
 * space, so an artifact delivered after turn 7 renders after turn 7 — the
 * transcript is a single chronological record rather than three parallel ones.
 *
 * The transcript is authoritative and continuous: a state change APPENDS, and
 * never clears, resets or reorders prior items (Surface 1 v5.0 §3.7). That is
 * why there is no "reset" here — only a re-fetch, which replaces the thread's
 * contents with the server's own ordered answer.
 *
 * `gap` reports a break in the turn sequence. Phase 2 uses it to trigger a
 * re-fetch rather than rendering a hole.
 */
export type TranscriptItem =
  | { kind: 'turn'; seq: number; id: string; turn: Turn }
  | { kind: 'artifact'; seq: number; id: string; artifact: Artifact }
  | { kind: 'card'; seq: number; id: string; card: InlineCard };

export interface UseTranscriptResult {
  turns: Turn[];
  items: TranscriptItem[];
  loading: boolean;
  error: string | null;
  gap: boolean;
  refresh: () => void;
}

export function useTranscript(threadId: string | null): UseTranscriptResult {
  const turnsByThread = useTranscriptStore((s) => s.turnsByThread);
  const replace = useTranscriptStore((s) => s.replace);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { artifacts, cards, refresh: refreshArtifacts } = useArtifacts(threadId);

  const turns = useMemo(
    () => (threadId ? turnsByThread[threadId] ?? [] : []),
    [turnsByThread, threadId],
  );

  const refresh = useCallback(() => {
    if (!threadId) return;
    void (async () => {
      setLoading(true);
      const { data, error: err } = await threadsApi.get(threadId);
      if (data) {
        replace(threadId, data.turns ?? []);
        setError(null);
      } else if (err) {
        setError(err);
      }
      setLoading(false);
    })();
    refreshArtifacts();
  }, [threadId, replace, refreshArtifacts]);

  useEffect(() => {
    /* Only fetch a thread we have nothing for. Re-fetching one that already has
       turns would fight the optimistic append the composer just made. */
    if (!threadId) return;
    if ((turnsByThread[threadId] ?? []).length > 0) return;
    refresh();
    // `turnsByThread` is deliberately not a dependency: this runs on thread
    // change, not on every append.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, refresh]);

  /**
   * One ordered list.
   *
   * Ties are broken turn → artifact → card, which is the order they are produced
   * in: a turn arrives, it may deliver an artifact, and the artifact may carry a
   * next step. Rendering a card above the answer it belongs to would read as a
   * push rather than a consequence.
   */
  const items = useMemo<TranscriptItem[]>(() => {
    const merged: TranscriptItem[] = [
      ...turns.map((turn) => ({ kind: 'turn' as const, seq: turn.seq, id: turn.id, turn })),
      ...artifacts.map((a) => ({ kind: 'artifact' as const, seq: a.seq, id: a.id, artifact: a })),
      ...cards.map((c) => ({ kind: 'card' as const, seq: c.seq, id: c.id, card: c })),
    ];

    const rank = { turn: 0, artifact: 1, card: 2 } as const;
    return merged.sort((a, b) => (a.seq - b.seq) || (rank[a.kind] - rank[b.kind]));
  }, [turns, artifacts, cards]);

  return { turns, items, loading, error, gap: hasGap(turns), refresh };
}
