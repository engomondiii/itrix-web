import type { QualificationAnswers, QuestionId } from '@/types/qualification.types';
import type { ScoreBreakdown, ScoringCategory } from '@/types/lead.types';
import { getQuestion } from '@/lib/content/qualificationQuestions';
import { CATEGORY_WEIGHT, SCORING_CATEGORIES } from './scoringWeights';

function asSingle(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}
function asMulti(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v;
  return v ? [v] : [];
}

/** Returns the chosen option's `weight` for a single-select question (0 if none). */
function optionWeight(id: QuestionId, answers: QualificationAnswers): number {
  const value = asSingle(answers[id]);
  if (!value) return 0;
  const opt = getQuestion(id).options.find((o) => o.value === value);
  return opt?.weight ?? 0;
}

/**
 * Provisional, deterministic client-side score for immediate feedback. The backend
 * remains authoritative on /review/sessions/{id}/qualify/; when its breakdown is
 * available the UI prefers it. Categories never exceed their weight (total ≤ 100).
 */
export function scoreAnswers(answers: QualificationAnswers): { breakdown: ScoreBreakdown; total: number } {
  // strategic_fit (25) — Q6
  const strategic_fit = Math.min(CATEGORY_WEIGHT.strategic_fit, optionWeight('Q6', answers));

  // technical_fit (25) — derived from Q1 (env), Q2 (pressures), Q3 (structure)
  const structure = asSingle(answers.Q3);
  const structurePts =
    structure === 'mixed' ? 14 : structure === 'unsure' ? 5 : structure ? 12 : 0;
  const envPts = asSingle(answers.Q1) ? 8 : 0;
  const pressurePts = Math.min(3, asMulti(answers.Q2).length);
  const technical_fit = Math.min(CATEGORY_WEIGHT.technical_fit, structurePts + envPts + pressurePts);

  // urgency (20) — blend Q4 + Q5
  const urgency = Math.min(
    CATEGORY_WEIGHT.urgency,
    Math.round((optionWeight('Q4', answers) + optionWeight('Q5', answers)) / 2),
  );

  // budget_authority (15) — blend Q7 + Q8
  const budget_authority = Math.min(
    CATEGORY_WEIGHT.budget_authority,
    Math.round((optionWeight('Q7', answers) + optionWeight('Q8', answers)) / 2),
  );

  // license_potential (15) — Q9
  const license_potential = Math.min(CATEGORY_WEIGHT.license_potential, optionWeight('Q9', answers));

  const breakdown: ScoreBreakdown = {
    strategic_fit,
    technical_fit,
    urgency,
    budget_authority,
    license_potential,
  };
  const total = SCORING_CATEGORIES.reduce((sum, c: ScoringCategory) => sum + breakdown[c], 0);
  return { breakdown, total };
}
