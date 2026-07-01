import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReviewStep, PressureArea, ImmediateResponse } from '@/types/review.types';
import type { QualificationAnswers, QuestionId } from '@/types/qualification.types';
import type { ChatMessage } from '@/types/chat.types';

interface ReviewState {
  sessionId: string | null;
  /** The journey capability token minted at qualify (for /c/[token]). */
  journeyToken: string | null;
  step: ReviewStep;
  /** Which stage of the two-stage flow the visitor is on. */
  stage: 'stage_1' | 'stage_2';
  prompt: string;
  selectedPressures: PressureArea[];
  environment: string | null;
  answers: QualificationAnswers;
  immediateResponse: ImmediateResponse | null;
  /** The Concierge conversation transcript for the review surface. */
  transcript: ChatMessage[];

  setSession: (id: string | null) => void;
  setJourneyToken: (token: string | null) => void;
  setStep: (step: ReviewStep) => void;
  setStage: (stage: 'stage_1' | 'stage_2') => void;
  setPrompt: (prompt: string) => void;
  togglePressure: (area: PressureArea) => void;
  setPressures: (areas: PressureArea[]) => void;
  setEnvironment: (value: string | null) => void;
  setAnswer: (id: QuestionId, value: string | string[]) => void;
  setAnswers: (answers: QualificationAnswers) => void;
  setImmediateResponse: (res: ImmediateResponse | null) => void;
  addTranscriptMessage: (message: ChatMessage) => void;
  reset: () => void;
}

const initial = {
  sessionId: null,
  journeyToken: null,
  step: 'prompt' as ReviewStep,
  stage: 'stage_1' as 'stage_1' | 'stage_2',
  prompt: '',
  selectedPressures: [] as PressureArea[],
  environment: null as string | null,
  answers: {} as QualificationAnswers,
  immediateResponse: null as ImmediateResponse | null,
  transcript: [] as ChatMessage[],
};

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      ...initial,
      setSession: (sessionId) => set({ sessionId }),
      setJourneyToken: (journeyToken) => set({ journeyToken }),
      setStep: (step) => set({ step }),
      setStage: (stage) => set({ stage }),
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
      addTranscriptMessage: (message) => set((s) => ({ transcript: [...s.transcript, message] })),
      reset: () => set({ ...initial }),
    }),
    { name: 'itrix-review' },
  ),
);
