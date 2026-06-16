import type { LeadTier } from '@/types/lead.types';
import { TIERS, tierForScore } from '@/constants/tiers';
import type { TierDefinition } from '@/constants/tiers';

export { tierForScore };

export function classifyTier(total: number): { tier: LeadTier; definition: TierDefinition } {
  const tier = tierForScore(total);
  return { tier, definition: TIERS[tier] };
}

export function tierDefinition(tier: LeadTier): TierDefinition {
  return TIERS[tier];
}
