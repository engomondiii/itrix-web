import type { ScoreBreakdown, ScoringCategory } from '@/types/lead.types';
import { CATEGORY_LABEL, CATEGORY_WEIGHT, SCORING_CATEGORIES } from '@/lib/scoring/scoringWeights';

export function formatScore(total: number): string {
  return `${Math.round(total)} / 100`;
}

export interface ScoreRow {
  category: ScoringCategory;
  label: string;
  value: number;
  max: number;
  percent: number;
}

export function formatBreakdown(breakdown: ScoreBreakdown): ScoreRow[] {
  return SCORING_CATEGORIES.map((category) => {
    const value = breakdown[category];
    const max = CATEGORY_WEIGHT[category];
    return {
      category,
      label: CATEGORY_LABEL[category],
      value,
      max,
      percent: max > 0 ? Math.round((value / max) * 100) : 0,
    };
  });
}
