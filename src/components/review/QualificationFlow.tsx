'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { QuestionProgressBar } from './QuestionProgressBar';
import { QualificationQuestion } from './QualificationQuestion';
import { ReviewSubmitButton } from './ReviewSubmitButton';
import { useQualificationAnswers } from '@/hooks/useQualificationAnswers';
import { useReviewFlow } from '@/hooks/useReviewFlow';
import { QUALIFICATION_QUESTIONS } from '@/lib/content/qualificationQuestions';

export function QualificationFlow() {
  const { answers, setAnswer, isAnswered } = useQualificationAnswers();
  const { submitQualification, submitting, error } = useReviewFlow();
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  const total = QUALIFICATION_QUESTIONS.length;
  const question = QUALIFICATION_QUESTIONS[index];
  const isLast = index === total - 1;
  const canAdvance = !question.required || isAnswered(question.id);

  function next() {
    if (!canAdvance) {
      setTouched(true);
      return;
    }
    setTouched(false);
    if (isLast) {
      void submitQualification();
    } else {
      setIndex((i) => Math.min(total - 1, i + 1));
    }
  }
  function back() {
    setTouched(false);
    setIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="flex flex-col gap-8">
      <QuestionProgressBar current={index + 1} total={total} />

      <QualificationQuestion question={question} value={answers[question.id]} onChange={(v) => setAnswer(question.id, v)} />

      {touched && !canAdvance ? <ErrorMessage>Select an option to continue.</ErrorMessage> : null}
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}

      <div className="flex items-center justify-between gap-3 border-t border-line-subtle pt-5">
        <Button variant="ghost" size="md" onClick={back} disabled={index === 0 || submitting}>
          ← Back
        </Button>
        {isLast ? (
          <ReviewSubmitButton onClick={next} loading={submitting} disabled={!canAdvance}>
            See my result
          </ReviewSubmitButton>
        ) : (
          <Button variant="primary" size="md" onClick={next} disabled={submitting}>
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
