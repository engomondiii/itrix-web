'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useReviewStore } from '@/store/reviewStore';
import type { ReviewStep, PressureArea, ImmediateResponse } from '@/types/review.types';
import type { QualificationAnswers, QuestionId } from '@/types/qualification.types';
import type { ChatMessage } from '@/types/chat.types';

interface ReviewContextValue {
  sessionId: string | null;
  journeyToken: string | null;
  step: ReviewStep;
  stage: 'stage_1' | 'stage_2';
  prompt: string;
  selectedPressures: PressureArea[];
  environment: string | null;
  answers: QualificationAnswers;
  immediateResponse: ImmediateResponse | null;
  transcript: ChatMessage[];
  setPrompt: (prompt: string) => void;
  togglePressure: (area: PressureArea) => void;
  setEnvironment: (value: string | null) => void;
  setAnswer: (id: QuestionId, value: string | string[]) => void;
  setStep: (step: ReviewStep) => void;
  setStage: (stage: 'stage_1' | 'stage_2') => void;
}

const ReviewContext = createContext<ReviewContextValue | null>(null);

/** Exposes the review session (zustand-backed) to the /review segment, including
 *  the journey token + Concierge transcript that carry through the conversation. */
export function ReviewProvider({ children }: { children: ReactNode }) {
  const s = useReviewStore();
  const value: ReviewContextValue = {
    sessionId: s.sessionId,
    journeyToken: s.journeyToken,
    step: s.step,
    stage: s.stage,
    prompt: s.prompt,
    selectedPressures: s.selectedPressures,
    environment: s.environment,
    answers: s.answers,
    immediateResponse: s.immediateResponse,
    transcript: s.transcript,
    setPrompt: s.setPrompt,
    togglePressure: s.togglePressure,
    setEnvironment: s.setEnvironment,
    setAnswer: s.setAnswer,
    setStep: s.setStep,
    setStage: s.setStage,
  };
  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview(): ReviewContextValue {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReview must be used within a ReviewProvider');
  return ctx;
}
