import type { ScoringCategory } from './lead.types';

/** Compute Bottleneck Review — qualification questions Q1–Q9. */
export type QuestionId = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'Q7' | 'Q8' | 'Q9';

export type QuestionType = 'single' | 'multi';

export interface QuestionOption {
  value: string;
  label: string;
  /** Points contributed toward the question's scoring category (0–weight). */
  weight?: number;
}

export interface QualificationQuestion {
  id: QuestionId;
  prompt: string;
  helper?: string;
  type: QuestionType;
  options: QuestionOption[];
  /** Which of the five scoring categories this question feeds. */
  category: ScoringCategory;
  required: boolean;
}

/** Visitor selections, keyed by question id. Single = string, multi = string[]. */
export type QualificationAnswers = Partial<Record<QuestionId, string | string[]>>;

export interface PlatformEnvironment {
  value: string;
  label: string;
  family: 'numerical' | 'simulation' | 'ai_ml' | 'systems' | 'hardware' | 'other';
}
