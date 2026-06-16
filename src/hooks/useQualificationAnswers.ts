'use client';

import { useReviewStore } from '@/store/reviewStore';
import { TOTAL_QUESTIONS } from '@/lib/content/qualificationQuestions';
import { validateAnswers, answeredCount, isQuestionAnswered } from '@/lib/validation/qualificationValidator';
import type { QuestionId } from '@/types/qualification.types';

export function useQualificationAnswers() {
  const answers = useReviewStore((s) => s.answers);
  const setAnswer = useReviewStore((s) => s.setAnswer);

  const validation = validateAnswers(answers);
  const completed = answeredCount(answers);

  return {
    answers,
    setAnswer,
    isAnswered: (id: QuestionId) => isQuestionAnswered(answers, id),
    valid: validation.valid,
    missing: validation.missing,
    completed,
    total: TOTAL_QUESTIONS,
    progress: TOTAL_QUESTIONS > 0 ? Math.round((completed / TOTAL_QUESTIONS) * 100) : 0,
  };
}
