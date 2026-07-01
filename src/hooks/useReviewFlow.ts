'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReviewStore } from '@/store/reviewStore';
import { useLeadStore } from '@/store/leadStore';
import { useVisitor } from '@/context/VisitorContext';
import { reviewApi } from '@/lib/api/reviewApi';
import { scoreAnswers } from '@/lib/scoring/leadScorer';
import { classifyTier } from '@/lib/scoring/tierClassifier';
import { routeProduct } from '@/lib/routing/productRouter';
import { routeLicense } from '@/lib/routing/licenseRouter';
import { buildImmediateResponse } from '@/lib/content/immediateResponses';
import { validatePromptSubmission } from '@/lib/validation/reviewValidator';
import { validateAnswers } from '@/lib/validation/qualificationValidator';
import { trackReviewStart } from '@/lib/analytics/trackReviewStart';
import { trackReviewComplete } from '@/lib/analytics/trackReviewComplete';
import { routes } from '@/constants/routes';
import type { QualificationAnswers } from '@/types/qualification.types';
import type { ScoreBreakdown, LeadTier } from '@/types/lead.types';
import type { ProductRoute, LicensePathway } from '@/types/product.types';

interface LocalScoring {
  breakdown: ScoreBreakdown;
  total: number;
  tier: LeadTier;
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
}

function localScoring(answers: QualificationAnswers): LocalScoring {
  const { breakdown, total } = scoreAnswers(answers);
  const { tier } = classifyTier(total);
  return { breakdown, total, tier, productRoute: routeProduct(answers), licensePathway: routeLicense(answers) };
}

/**
 * Drives the two-stage review conversation. v3.0 change: after qualification, the
 * backend creates the lead, advances the journey to DIAGNOSED, and mints a
 * client-page capability token. This hook stores that token + journey state and
 * routes to the /review/preparing hand-off (which forwards to /c/[token]). The old
 * standalone result page is gone; scoring stays backend-first with a local estimate
 * fallback so the flow always resolves.
 */
export function useReviewFlow() {
  const router = useRouter();
  const { clientId, visitorType } = useVisitor();

  const review = useReviewStore();
  const setScoring = useLeadStore((s) => s.setScoring);
  const setCapabilityToken = useLeadStore((s) => s.setCapabilityToken);
  const setJourneyState = useLeadStore((s) => s.setJourneyState);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  /** Step 1 → 2: submit the prompt + pressures, capture a session, go to qualify. */
  async function submitPrompt() {
    const check = validatePromptSubmission({ prompt: review.prompt, selectedPressures: review.selectedPressures });
    if (!check.valid) {
      setPromptError(check.errors.prompt ?? 'Add a little more to begin.');
      return false;
    }
    setPromptError(null);
    setError(null);
    setSubmitting(true);
    try {
      const res = await reviewApi.submit({
        clientId,
        sessionId: review.sessionId,
        prompt: review.prompt,
        selectedPressures: review.selectedPressures,
        environment: review.environment,
        visitorType,
      });
      if (res.data) {
        review.setSession(res.data.sessionId);
        review.setImmediateResponse(res.data.immediateResponse);
      } else {
        review.setImmediateResponse(buildImmediateResponse(review.prompt, review.selectedPressures));
      }
      trackReviewStart({ pressures: review.selectedPressures, environment: review.environment });
      review.setStep('qualify');
      review.setStage('stage_1');
      router.push(routes.reviewQualify);
      return true;
    } finally {
      setSubmitting(false);
    }
  }

  /** Step 2 → preparing: submit answers, score (backend-first), store the capability
   *  token, and hand off to the preparing page (which forwards to /c/[token]). */
  async function submitQualification() {
    const check = validateAnswers(review.answers);
    if (!check.valid) {
      setError('Please answer the remaining questions before continuing.');
      return false;
    }
    setError(null);
    setSubmitting(true);
    try {
      let scoring = localScoring(review.answers);
      let leadId: string | null = null;
      let capabilityToken: string | null = null;

      const qualifyRes = await reviewApi.qualify({
        sessionId: review.sessionId,
        clientId,
        answers: review.answers,
      });
      if (qualifyRes.data) {
        const d = qualifyRes.data;
        leadId = d.leadId;
        scoring = {
          breakdown: d.scoreBreakdown,
          total: d.totalScore,
          tier: d.tier,
          productRoute: d.productRoute,
          licensePathway: d.licensePathway,
        };
        capabilityToken = d.capabilityToken ?? null;
        if (d.journeyState) setJourneyState(d.journeyState);
      }

      setScoring({
        leadId,
        totalScore: scoring.total,
        scoreBreakdown: scoring.breakdown,
        tier: scoring.tier,
        productRoute: scoring.productRoute,
        licensePathway: scoring.licensePathway,
      });
      if (capabilityToken) {
        setCapabilityToken(capabilityToken);
        review.setJourneyToken(capabilityToken);
      }

      trackReviewComplete({ tier: scoring.tier, totalScore: scoring.total, productRoute: scoring.productRoute, leadId });
      review.setStep('preparing');
      router.push(routes.reviewPreparing);
      return true;
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    review.reset();
    useLeadStore.getState().reset();
    router.push(routes.review);
  }

  return {
    step: review.step,
    submitting,
    error,
    promptError,
    submitPrompt,
    submitQualification,
    restart,
  };
}
