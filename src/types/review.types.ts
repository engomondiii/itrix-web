import type { QualificationAnswers } from './qualification.types';

/** The seven AI-aggravated pressure areas (Knowledge Core section 7). */
export type PressureArea =
  | 'cost'
  | 'speed'
  | 'energy'
  | 'stability_accuracy'
  | 'memory_data_movement'
  | 'hardware_utilization'
  | 'architecture';

export interface PressureSignal {
  area: PressureArea;
  label: string;
  prompt: string; // visitor-facing phrasing of the pressure
}

export type ReviewStep = 'prompt' | 'qualify' | 'result' | 'confirmation';

export interface PromptSubmission {
  sessionId: string | null;
  prompt: string;
  selectedPressures: PressureArea[];
  environment: string | null;
}

export interface ImmediateResponse {
  acknowledgement: string;
  recognizedPressures: PressureArea[];
  ndaSensitive: boolean;
}

export interface ReviewSession {
  id: string | null;
  step: ReviewStep;
  submission: PromptSubmission | null;
  answers: QualificationAnswers;
}
