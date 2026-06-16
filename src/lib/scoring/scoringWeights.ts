import { SCORING_WEIGHTS, SCORING_TOTAL } from '@/constants/scoring';
import type { ScoringCategory } from '@/types/lead.types';

export { SCORING_WEIGHTS, SCORING_TOTAL };

/** category -> max points (strategic 25 / technical 25 / urgency 20 / budget 15 / license 15). */
export const CATEGORY_WEIGHT: Record<ScoringCategory, number> = SCORING_WEIGHTS.reduce(
  (acc, w) => {
    acc[w.category] = w.weight;
    return acc;
  },
  {} as Record<ScoringCategory, number>,
);

export const CATEGORY_LABEL: Record<ScoringCategory, string> = SCORING_WEIGHTS.reduce(
  (acc, w) => {
    acc[w.category] = w.label;
    return acc;
  },
  {} as Record<ScoringCategory, string>,
);

export const SCORING_CATEGORIES: ScoringCategory[] = SCORING_WEIGHTS.map((w) => w.category);
