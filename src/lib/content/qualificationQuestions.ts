import { QUALIFICATION_QUESTIONS } from '@/config/review.config';
import type { QualificationQuestion, QuestionId } from '@/types/qualification.types';

export { QUALIFICATION_QUESTIONS };

export const QUESTION_IDS: QuestionId[] = QUALIFICATION_QUESTIONS.map((q) => q.id);

const BY_ID: Record<QuestionId, QualificationQuestion> = QUALIFICATION_QUESTIONS.reduce(
  (acc, q) => {
    acc[q.id] = q;
    return acc;
  },
  {} as Record<QuestionId, QualificationQuestion>,
);

export function getQuestion(id: QuestionId): QualificationQuestion {
  return BY_ID[id];
}

export function optionLabel(id: QuestionId, value: string): string {
  return BY_ID[id]?.options.find((o) => o.value === value)?.label ?? value;
}

export const TOTAL_QUESTIONS = QUALIFICATION_QUESTIONS.length;
