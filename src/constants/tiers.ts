import type { LeadTier } from '@/types/lead.types';

export interface TierDefinition {
  tier: LeadTier;
  label: string;
  min: number; // inclusive
  max: number; // inclusive
  responseSla: string; // human-readable follow-up target
  tone: 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4';
}

/** Mirrors backend scoring.tier_classifier band boundaries. */
export const TIERS: Record<LeadTier, TierDefinition> = {
  1: { tier: 1, label: 'Strategic', min: 80, max: 100, responseSla: 'Within 24 hours', tone: 'tier-1' },
  2: { tier: 2, label: 'Qualified', min: 60, max: 79, responseSla: 'Within 48 hours', tone: 'tier-2' },
  3: { tier: 3, label: 'Nurture', min: 40, max: 59, responseSla: 'Automated nurture', tone: 'tier-3' },
  4: { tier: 4, label: 'Exploratory', min: 0, max: 39, responseSla: 'Self-serve resources', tone: 'tier-4' },
};

export function tierForScore(score: number): LeadTier {
  if (score >= 80) return 1;
  if (score >= 60) return 2;
  if (score >= 40) return 3;
  return 4;
}
