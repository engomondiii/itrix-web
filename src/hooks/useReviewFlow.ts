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
import { PRESSURE_BY_AREA } from '@/lib/content/pressureSignals';
import { getProductRoute } from '@/lib/content/productRoutes';
import { getEnvironment } from '@/lib/content/platformEnvironments';
import { PRESSURE_ACK } from '@/lib/content/immediateResponses';
import { validatePromptSubmission } from '@/lib/validation/reviewValidator';
import { validateAnswers } from '@/lib/validation/qualificationValidator';
import { trackReviewStart } from '@/lib/analytics/trackReviewStart';
import { trackReviewComplete } from '@/lib/analytics/trackReviewComplete';
import { APPROVED_CLAIM_FRAMING } from '@/constants/disclosure';
import { routes } from '@/constants/routes';
import type { PressureArea } from '@/types/review.types';
import type { QualificationAnswers } from '@/types/qualification.types';
import type { ScoreBreakdown, LeadTier } from '@/types/lead.types';
import type { ProductRoute, LicensePathway } from '@/types/product.types';
import type { ResultPage, DiagnosisRow } from '@/types/result.types';

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

/** Deterministic, on-message result built entirely client-side. Used as a fallback
 *  when the Django result endpoint is unavailable, so the funnel always resolves. */
function buildLocalResult(args: {
  leadId: string | null;
  prompt: string;
  pressures: PressureArea[];
  environment: string | null;
  scoring: LocalScoring;
}): ResultPage {
  const { leadId, prompt, pressures, environment, scoring } = args;
  const info = getProductRoute(scoring.productRoute);
  const env = getEnvironment(environment);
  const topPressures = pressures.slice(0, 3);

  const diagnosis: DiagnosisRow[] = topPressures.map((area) => ({
    pressure: area,
    observation: PRESSURE_BY_AREA[area]?.prompt ?? '',
    itrixInterpretation: PRESSURE_ACK[area],
    alphaRole:
      scoring.productRoute === 'alpha_core'
        ? 'ALPHA Core — validate the transformed form on real hardware'
        : 'ALPHA Compute — diagnose the representation first',
  }));

  const problemMirror =
    (prompt.trim()
      ? `You described: “${prompt.trim().slice(0, 220)}”. `
      : '') +
    (topPressures.length
      ? `We read pressure on ${topPressures.map((p) => PRESSURE_BY_AREA[p].label.toLowerCase()).join(', ')}`
      : 'We’ll start from the workload') +
    (env ? `, running on ${env.label}.` : '.');

  return {
    leadId: leadId ?? 'local',
    tier: scoring.tier,
    scoreBreakdown: scoring.breakdown,
    productRoute: scoring.productRoute,
    licensePathway: scoring.licensePathway,
    primaryTechnologies: info.technologies,
    problemMirror,
    diagnosis,
    alphaFitSummary: `${info.blurb} On eligible workloads this may deliver ${APPROVED_CLAIM_FRAMING.conservative}, ${APPROVED_CLAIM_FRAMING.validation}.`,
    kpiPreview: [
      { label: 'Arithmetic', metric: '~3–4× reduction (eligible workloads)' },
      { label: 'Accuracy', metric: 'Preserved, PoC-validated' },
      { label: 'Approach', metric: 'Representation-first' },
    ],
    proofPreview: [
      { title: 'FQNM method paper', disclosure: 'public', reference: 'arXiv:2604.06947' },
      { title: 'Workload benchmark figures', disclosure: 'nda_only' },
    ],
    recommendedNextStep:
      scoring.tier <= 2
        ? 'A member of the iTrix Assessment Team will review your inputs and reach out personally.'
        : 'Explore the technology and the recommended product, then start a review when you’re ready.',
  };
}

export function useReviewFlow() {
  const router = useRouter();
  const { clientId, visitorType } = useVisitor();

  const review = useReviewStore();
  const setScoring = useLeadStore((s) => s.setScoring);
  const setResult = useLeadStore((s) => s.setResult);

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
        // Backend unavailable — proceed with a local acknowledgement.
        review.setImmediateResponse(buildImmediateResponse(review.prompt, review.selectedPressures));
      }
      trackReviewStart({ pressures: review.selectedPressures, environment: review.environment });
      review.setStep('qualify');
      router.push(routes.reviewQualify);
      return true;
    } finally {
      setSubmitting(false);
    }
  }

  /** Step 2 → 3: submit answers, score (backend-first), generate the result, go to result. */
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
      }

      setScoring({
        leadId,
        totalScore: scoring.total,
        scoreBreakdown: scoring.breakdown,
        tier: scoring.tier,
        productRoute: scoring.productRoute,
        licensePathway: scoring.licensePathway,
      });

      // Generate / fetch the personalized result (backend-first, local fallback).
      const resultRes = await reviewApi.result({ leadId, sessionId: review.sessionId, answers: review.answers });
      const result =
        resultRes.data ??
        buildLocalResult({
          leadId,
          prompt: review.prompt,
          pressures: review.selectedPressures,
          environment: review.environment,
          scoring,
        });
      setResult(result);

      trackReviewComplete({ tier: scoring.tier, totalScore: scoring.total, productRoute: scoring.productRoute, leadId });
      review.setStep('result');
      router.push(routes.reviewResult);
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
