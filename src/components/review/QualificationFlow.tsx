'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { QuestionProgressBar } from './QuestionProgressBar';
import { QualificationQuestion } from './QualificationQuestion';
import { StageHint } from './StageHint';
import { ReviewSubmitButton } from './ReviewSubmitButton';
import { useQualificationAnswers } from '@/hooks/useQualificationAnswers';
import { useReviewFlow } from '@/hooks/useReviewFlow';
import { useReviewStore } from '@/store/reviewStore';
import {
  STAGE_1,
  STAGE_2,
  getQuestion,
  stageOfQuestion,
  STAGED_QUESTION_IDS,
} from '@/lib/content/qualificationQuestions';

/**
 * The two-stage adaptive pain-gain flow. Presents the preserved Q1–Q9 grouped into
 * Stage 1 (frictionless) then Stage 2 (earned), one question per screen, with a calm
 * StageHint. "Not sure" is offered on every question. No score or tier is ever
 * shown. The last question submits qualification, which hands off to /review/preparing.
 */
export function QualificationFlow() {
  const { answers, setAnswer, isAnswered } = useQualificationAnswers();
  const { submitQualification, submitting, error } = useReviewFlow();
  const setStage = useReviewStore((s) => s.setStage);

  const order = STAGED_QUESTION_IDS;
  const total = order.length;
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  const currentId = order[index];
  const question = getQuestion(currentId);
  const currentStage = stageOfQuestion(currentId);
  const isLast = index === total - 1;
  const canAdvance = !question.required || isAnswered(currentId);

  const stageEyebrow = useMemo(
    () => (currentStage === 'stage_1' ? STAGE_1.eyebrow : STAGE_2.eyebrow),
    [currentStage],
  );

  function next() {
    if (!canAdvance) {
      setTouched(true);
      return;
    }
    setTouched(false);
    if (isLast) {
      void submitQualification();
    } else {
      const nextIndex = Math.min(total - 1, index + 1);
      setIndex(nextIndex);
      setStage(stageOfQuestion(order[nextIndex]));
    }
  }

  function back() {
    setTouched(false);
    const prevIndex = Math.max(0, index - 1);
    setIndex(prevIndex);
    setStage(stageOfQuestion(order[prevIndex]));
  }

  return (
    <div className="flex flex-col gap-6">
      <StageHint stage={currentStage} eyebrow={stageEyebrow} />
      <QuestionProgressBar current={index + 1} total={total} />

      <QualificationQuestion
        question={question}
        value={answers[currentId]}
        onChange={(v) => setAnswer(currentId, v)}
      />

      {touched && !canAdvance ? <ErrorMessage>Select an option, or choose “Not sure,” to continue.</ErrorMessage> : null}
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}

      <div className="flex items-center justify-between gap-3 border-t border-line-subtle pt-5">
        <Button variant="ghost" size="md" onClick={back} disabled={index === 0 || submitting}>
          ← Back
        </Button>
        {isLast ? (
          <ReviewSubmitButton onClick={next} loading={submitting} disabled={!canAdvance}>
            Prepare my review
          </ReviewSubmitButton>
        ) : (
          <Button variant="primary" size="md" onClick={next} disabled={submitting}>
            Continue →
          </Button>
        )}
      </div>
    </div>
  );
}
