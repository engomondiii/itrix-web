import type { PortalEvaluation } from '@/types/portal.types';

export interface AlphaAssessmentFacts {
  eligibility: string | null;
  assessmentState: string | null;
  feeState: string | null;
  waiverState: string | null;
  entitlementState: string | null;
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/**
 * Keep the five customer-facing ALPHA dimensions independent. In particular,
 * waived fee treatment never manufactures eligibility or entitlement.
 */
export function alphaAssessmentFacts(evaluation: PortalEvaluation): AlphaAssessmentFacts {
  return {
    eligibility: text(evaluation.eligibilityState) ?? text(evaluation.eligibility_state),
    assessmentState: text(evaluation.assessmentState) ?? text(evaluation.assessment_state) ?? text(evaluation.stage),
    feeState: text(evaluation.feeState) ?? text(evaluation.fee_state) ?? text(evaluation.customerFeeStatus),
    waiverState: text(evaluation.waiverState) ?? text(evaluation.waiver_state),
    entitlementState: text(evaluation.entitlementState) ?? text(evaluation.entitlement_state),
  };
}

/** Canonical display guard: zero is valid; negative/invalid ordering is unavailable. */
export function safeTtfvSeconds(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}
