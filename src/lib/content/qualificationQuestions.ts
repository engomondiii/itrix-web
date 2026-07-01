/**
 * Qualification questions — two-stage adaptive pain-gain flow (Playbook §25),
 * layered over the preserved Q1–Q9 model so the deterministic scorer, validator,
 * and answers hook keep working unchanged.
 *
 * IMPORTANT INTEGRATION CONTRACT:
 *   - QUALIFICATION_QUESTIONS, getQuestion, optionLabel, QUESTION_IDS, TOTAL_QUESTIONS
 *     remain exported with the same shapes (leadScorer / qualificationValidator /
 *     useQualificationAnswers depend on them). Q-ids and weights are untouched.
 *   - The two-stage layer (STAGE_1 / STAGE_2 / REVIEW_STAGES) is a presentation
 *     grouping over those same Q-ids. Stage 1 is frictionless (never shows a score
 *     or tier); Stage 2 is "earned" and asks the commercial-signal questions.
 *   - Every question renders a "Not sure" affordance in the flow (see StageHint /
 *     QualificationQuestion); selecting it stores 'unsure' where an option exists,
 *     otherwise leaves the (optional) question unanswered.
 */

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

/* ------------------------------------------------------------------ */
/* Two-stage layer (Playbook §25)                                      */
/* ------------------------------------------------------------------ */

export type ReviewStageId = 'stage_1' | 'stage_2';

export interface ReviewStage {
  id: ReviewStageId;
  /** Calm, conversational eyebrow shown above the stage's questions. */
  eyebrow: string;
  title: string;
  intro: string;
  /** The Q-ids asked in this stage, in order. */
  questionIds: QuestionId[];
}

/**
 * STAGE 1 — frictionless pain-gain. What is limiting them, who they are, what
 * the workload is, what gain they want. No commercial pressure, no score.
 *   S1.1 main pressure   → Q2 (what is becoming expensive)
 *   S1.2 org type        → Q6 (organization)
 *   S1.3 workload        → Q1 (environment) + Q3 (structure)
 *   S1.4 desired gain    → Q5 (severity, framed as the gain at stake)
 */
export const STAGE_1: ReviewStage = {
  id: 'stage_1',
  eyebrow: 'A few words about the workload',
  title: 'Where is computation becoming the limit?',
  intro:
    'A few short questions help us prepare something specific to your situation. This takes about a minute, and nothing here needs to be confidential.',
  questionIds: ['Q2', 'Q6', 'Q1', 'Q3', 'Q5'],
};

/**
 * STAGE 2 — earned. Asked once Stage 1 shows a real problem; these carry the
 * commercial signal (role, urgency, budget posture, licensing interest, rights).
 *   S2.1 role            → Q7
 *   S2.2 urgency         → Q4
 *   S2.3 budget posture  → Q8
 *   S2.4 licensing       → Q9
 */
export const STAGE_2: ReviewStage = {
  id: 'stage_2',
  eyebrow: 'A little more, to route you well',
  title: 'How should we take this forward?',
  intro:
    'These help us route you to the right path. There are no wrong answers, and “Not sure” is always fine.',
  questionIds: ['Q7', 'Q4', 'Q8', 'Q9'],
};

export const REVIEW_STAGES: ReviewStage[] = [STAGE_1, STAGE_2];

/** All question ids in two-stage presentation order (a permutation of Q1–Q9). */
export const STAGED_QUESTION_IDS: QuestionId[] = [...STAGE_1.questionIds, ...STAGE_2.questionIds];

export function getStage(id: ReviewStageId): ReviewStage {
  return id === 'stage_1' ? STAGE_1 : STAGE_2;
}

/** The stage a given question belongs to (used for the calm StageHint). */
export function stageOfQuestion(id: QuestionId): ReviewStageId {
  return STAGE_1.questionIds.includes(id) ? 'stage_1' : 'stage_2';
}

/** Human sub-label like "Step 1 of 2". Never a score or tier. */
export function stageLabel(id: ReviewStageId): string {
  return id === 'stage_1' ? 'Step 1 of 2' : 'Step 2 of 2';
}
