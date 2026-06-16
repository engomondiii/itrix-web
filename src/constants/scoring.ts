import type { ScoringCategory } from '@/types/lead.types';

export interface ScoringWeight {
  category: ScoringCategory;
  label: string;
  weight: number; // points out of 100
}

/** Mirrors the backend scoring weights (strategic 25 / technical 25 / urgency 20 / budget 15 / LO 15). */
export const SCORING_WEIGHTS: ScoringWeight[] = [
  { category: 'strategic_fit', label: 'Strategic fit', weight: 25 },
  { category: 'technical_fit', label: 'Technical fit', weight: 25 },
  { category: 'urgency', label: 'Urgency', weight: 20 },
  { category: 'budget_authority', label: 'Budget & authority', weight: 15 },
  { category: 'license_potential', label: 'License-out potential', weight: 15 },
];

export const SCORING_TOTAL = SCORING_WEIGHTS.reduce((sum, w) => sum + w.weight, 0); // 100
