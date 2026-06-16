'use client';

import { useMemo } from 'react';
import { useReviewStore } from '@/store/reviewStore';
import { useLeadStore } from '@/store/leadStore';
import { scoreAnswers } from '@/lib/scoring/leadScorer';
import type { ScoreBreakdown } from '@/types/lead.types';

/** Prefers the backend-authoritative score (lead store); otherwise computes a
 *  provisional client-side estimate from the current answers. */
export function useLeadScore(): { breakdown: ScoreBreakdown; total: number; fromBackend: boolean } {
  const answers = useReviewStore((s) => s.answers);
  const storedBreakdown = useLeadStore((s) => s.scoreBreakdown);
  const storedTotal = useLeadStore((s) => s.totalScore);

  return useMemo(() => {
    if (storedBreakdown && storedTotal !== null) {
      return { breakdown: storedBreakdown, total: storedTotal, fromBackend: true };
    }
    const local = scoreAnswers(answers);
    return { breakdown: local.breakdown, total: local.total, fromBackend: false };
  }, [answers, storedBreakdown, storedTotal]);
}
