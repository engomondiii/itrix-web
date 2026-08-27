'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReviewStore } from '@/store/reviewStore';
import { useVisitor } from '@/context/VisitorContext';
import { reviewApi } from '@/lib/api/reviewApi';
import { validatePromptSubmission } from '@/lib/validation/reviewValidator';
import { validateAnswers } from '@/lib/validation/qualificationValidator';
import { buildImmediateResponse } from '@/lib/content/immediateResponses';
import { trackReviewStart } from '@/lib/analytics/trackReviewStart';
import { routes } from '@/constants/routes';
import { useLocaleStore } from '@/store/localeStore';
import { qualificationUi } from '@/lib/i18n/qualificationLocale';

export function useReviewFlow() {
  const router = useRouter();
  const { clientId, visitorType } = useVisitor();
  const review = useReviewStore();
  const locale = useLocaleStore((s) => s.locale);
  const localized = qualificationUi(locale);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  async function submitPrompt() {
    const check = validatePromptSubmission({ prompt: review.prompt, selectedPressures: review.selectedPressures });
    if (!check.valid) { setPromptError(check.errors.prompt ?? (locale === 'ko' ? '시작하려면 내용을 조금 더 입력해 주세요.' : 'Add a little more to begin.')); return false; }
    setPromptError(null); setError(null); setSubmitting(true);
    try {
      const res = await reviewApi.submit({ clientId, sessionId: review.sessionId, prompt: review.prompt, selectedPressures: review.selectedPressures, environment: review.environment, visitorType, locale });
      if (res.data) { review.setSession(res.data.sessionId); review.setImmediateResponse(res.data.immediateResponse); }
      else review.setImmediateResponse(buildImmediateResponse(review.prompt, review.selectedPressures));
      trackReviewStart({ pressures: review.selectedPressures, environment: review.environment });
      review.setStep('qualify'); review.setStage('stage_1'); router.push(routes.reviewQualify); return true;
    } finally { setSubmitting(false); }
  }

  async function submitQualification() {
    const check = validateAnswers(review.answers);
    if (!check.valid) { setError(localized.required); return false; }
    if (!review.sessionId) { setError(locale === 'ko' ? '이 리뷰 세션을 사용할 수 없습니다. 처음부터 다시 시작해 주세요.' : 'This review session is unavailable. Please start again.'); return false; }
    setError(null); setSubmitting(true);
    try {
      const out = await reviewApi.qualify({ sessionId: review.sessionId, answers: review.answers });
      if (!out.data) { setError(out.error?.detail ?? (locale === 'ko' ? '리뷰를 시작하지 못했습니다. 다시 시도해 주세요.' : 'We could not start your review. Please try again.')); return false; }
      // Stay on this surface. The browser receives no score/tier/route and no review credential.
      review.setStep(out.data.generationStatus === 'ready' ? 'diagnosed' : 'preparing');
      return true;
    } finally { setSubmitting(false); }
  }

  function restart() { review.reset(); router.push(routes.review); }
  return { step: review.step, submitting, error, promptError, submitPrompt, submitQualification, restart };
}
