import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReviewStep, PressureArea, ImmediateResponse } from '@/types/review.types';
import type { QualificationAnswers, QuestionId } from '@/types/qualification.types';

interface ReviewState {
  sessionId: string | null;
  step: ReviewStep;
  prompt: string;
  selectedPressures: PressureArea[];
  environment: string | null;
  answers: QualificationAnswers;
  immediateResponse: ImmediateResponse | null;

  setSession: (id: string | null) => void;
  setStep: (step: ReviewStep) => void;
  setPrompt: (prompt: string) => void;
  togglePressure: (area: PressureArea) => void;
  setPressures: (areas: PressureArea[]) => void;
  setEnvironment: (value: string | null) => void;
  setAnswer: (id: QuestionId, value: string | string[]) => void;
  setAnswers: (answers: QualificationAnswers) => void;
  setImmediateResponse: (res: ImmediateResponse | null) => void;
  reset: () => void;
}

const initial = {
  sessionId: null,
  step: 'prompt' as ReviewStep,
  prompt: '',
  selectedPressures: [] as PressureArea[],
  environment: null as string | null,
  answers: {} as QualificationAnswers,
  immediateResponse: null as ImmediateResponse | null,
};

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      ...initial,
      setSession: (sessionId) => set({ sessionId }),
      setStep: (step) => set({ step }),
      setPrompt: (prompt) => set({ prompt }),
      togglePressure: (area) =>
        set((s) => ({
          selectedPressures: s.selectedPressures.includes(area)
            ? s.selectedPressures.filter((a) => a !== area)
            : [...s.selectedPressures, area],
        })),
      setPressures: (selectedPressures) => set({ selectedPressures }),
      setEnvironment: (environment) => set({ environment }),
      setAnswer: (id, value) => set((s) => ({ answers: { ...s.answers, [id]: value } })),
      setAnswers: (answers) => set({ answers }),
      setImmediateResponse: (immediateResponse) => set({ immediateResponse }),
      reset: () => set({ ...initial }),
    }),
    { name: 'itrix-review' },
  ),
);
