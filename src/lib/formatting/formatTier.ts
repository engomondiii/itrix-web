import type { LeadTier } from '@/types/lead.types';
import type { BadgeTone } from '@/components/ui/Badge';
import { TIERS } from '@/constants/tiers';

export function tierLabel(tier: LeadTier): string {
  return TIERS[tier].label;
}

export function tierSla(tier: LeadTier): string {
  return TIERS[tier].responseSla;
}

const TIER_TONE: Record<LeadTier, BadgeTone> = {
  1: 'tier-1',
  2: 'tier-2',
  3: 'tier-3',
  4: 'tier-4',
};

export function tierTone(tier: LeadTier): BadgeTone {
  return TIER_TONE[tier];
}
