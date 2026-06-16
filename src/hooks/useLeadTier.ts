'use client';

import { useLeadStore } from '@/store/leadStore';
import { useLeadScore } from './useLeadScore';
import { classifyTier } from '@/lib/scoring/tierClassifier';
import { TIERS } from '@/constants/tiers';

export function useLeadTier() {
  const storedTier = useLeadStore((s) => s.tier);
  const { total } = useLeadScore();

  if (storedTier) {
    return { tier: storedTier, definition: TIERS[storedTier], total };
  }
  const { tier, definition } = classifyTier(total);
  return { tier, definition, total };
}
