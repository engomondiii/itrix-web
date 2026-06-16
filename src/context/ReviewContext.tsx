'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useReviewStore } from '@/store/reviewStore';
import type { ReviewStep, PressureArea, ImmediateResponse } from '@/types/review.types';
import type { QualificationAnswers, QuestionId } from '@/types/qualification.types';

interface ReviewContextValue {
  sessionId: string | null;
  step: ReviewStep;
  prompt: string;
  selectedPressures: PressureArea[];
  environment: string | null;
  answers: QualificationAnswers;
  immediateResponse: ImmediateResponse | null;
  setPrompt: (prompt: string) => void;
  togglePressure: (area: PressureArea) => void;
  setEnvironment: (value: string | null) => void;
  setAnswer: (id: QuestionId, value: string | string[]) => void;
  setStep: (step: ReviewStep) => void;
}

const ReviewContext = createContext<ReviewContextValue | null>(null);

/** Exposes the review session (zustand-backed) to the /review segment. */
export function ReviewProvider({ children }: { children: ReactNode }) {
  const s = useReviewStore();
  const value: ReviewContextValue = {
    sessionId: s.sessionId,
    step: s.step,
    prompt: s.prompt,
    selectedPressures: s.selectedPressures,
    environment: s.environment,
    answers: s.answers,
    immediateResponse: s.immediateResponse,
    setPrompt: s.setPrompt,
    togglePressure: s.togglePressure,
    setEnvironment: s.setEnvironment,
    setAnswer: s.setAnswer,
    setStep: s.setStep,
  };
  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview(): ReviewContextValue {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReview must be used within a ReviewProvider');
  return ctx;
}
