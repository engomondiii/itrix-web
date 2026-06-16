import type { PromptSubmission } from '@/types/review.types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const PROMPT_MIN = 12;

/** A review needs either a described problem or at least one selected pressure. */
export function validatePromptSubmission(s: Pick<PromptSubmission, 'prompt' | 'selectedPressures'>): ValidationResult {
  const errors: Record<string, string> = {};
  const prompt = s.prompt.trim();
  if (prompt.length === 0 && s.selectedPressures.length === 0) {
    errors.prompt = 'Describe the workload or pick at least one pressure to start.';
  } else if (prompt.length > 0 && prompt.length < PROMPT_MIN) {
    errors.prompt = 'A little more detail helps us read the structure.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
