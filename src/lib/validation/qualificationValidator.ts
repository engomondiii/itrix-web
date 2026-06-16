import type { QualificationAnswers, QuestionId } from '@/types/qualification.types';
import { QUALIFICATION_QUESTIONS } from '@/lib/content/qualificationQuestions';

export interface QualificationValidation {
  valid: boolean;
  missing: QuestionId[];
}

function answered(v: string | string[] | undefined): boolean {
  if (Array.isArray(v)) return v.length > 0;
  return typeof v === 'string' && v.length > 0;
}

export function validateAnswers(answers: QualificationAnswers): QualificationValidation {
  const missing = QUALIFICATION_QUESTIONS.filter((q) => q.required && !answered(answers[q.id])).map(
    (q) => q.id,
  );
  return { valid: missing.length === 0, missing };
}

export function isQuestionAnswered(answers: QualificationAnswers, id: QuestionId): boolean {
  return answered(answers[id]);
}

export function answeredCount(answers: QualificationAnswers): number {
  return QUALIFICATION_QUESTIONS.filter((q) => answered(answers[q.id])).length;
}
