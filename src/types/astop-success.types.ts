/**
 * Customer-visible ASTOP Customer Success projection.
 *
 * This file is intentionally a whitelist. Internal trust, anti-abuse, security,
 * economics, readiness detail, IWL and waiver-policy reasoning have no type here,
 * which prevents ordinary UI code from depending on protected backend fields.
 */

export type GovernedNextAction =
  | string
  | { key?: string | null; action?: string | null }
  | null;

export type VerifiedValueProjection =
  | string
  | number
  | {
      summary?: string | null;
      display?: string | null;
      text?: string | null;
      value?: string | number | null;
      amount?: string | number | null;
      unit?: string | null;
      basis?: string | null;
      measurementBasis?: string | null;
      measurement_basis?: string | null;
    }
  | null;

export interface CustomerSafeProgression {
  currentMarketingStage?: string | null;
  astopVerified?: boolean;
  alphaComputeReady?: boolean;
  alphaCoreReady?: boolean;
  nextBestAction?: string | null;
}

export interface CustomerSafeSupportSummary {
  openCount?: number | null;
  blockingOpenCount?: number | null;
}

export interface CustomerSafeVerifiedValueSummary {
  verified?: boolean;
  technical?: {
    measured?: { sourceMeasurement?: string | null; available?: boolean; value?: unknown };
    estimated?: { sourceMeasurement?: string | null; available?: boolean; value?: unknown };
  };
  economic?: {
    status?: string | null;
    verified?: boolean;
    sourceMeasurement?: string | null;
    value?: unknown;
    currency?: string | null;
    unit?: string | null;
    claimScope?: string | null;
  };
}

export interface CustomerSafeAlphaAssessment {
  eligibility?: string | null;
  eligibilityState?: string | null;
  eligibility_state?: string | null;
  assessmentState?: string | null;
  assessment_state?: string | null;
  feeState?: string | null;
  fee_state?: string | null;
  waiverState?: string | null;
  waiver_state?: string | null;
  entitlement?: string | null;
  entitlementState?: string | null;
  entitlement_state?: string | null;
}

export interface AstopSuccessProjection {
  exists?: boolean;
  customerSuccessActive?: boolean;
  astopStage?: string | null;
  governedProgression?: CustomerSafeProgression | null;
  governedNextBestAction?: string | null;
  governedProgressionState?: string | null;
  governed_progression_state?: string | null;
  progressionState?: string | null;
  progression_state?: string | null;

  nextBestAction?: GovernedNextAction;
  next_best_action?: GovernedNextAction;
  nextRequiredAction?: string | null;
  next_required_action?: string | null;

  verifiedValue?: VerifiedValueProjection;
  verified_value?: VerifiedValueProjection;
  verifiedValueStatus?: string | null;
  verifiedValueSummary?: CustomerSafeVerifiedValueSummary | null;
  valueBasis?: string | null;
  value_basis?: string | null;
  measurementBasis?: string | null;
  measurement_basis?: string | null;

  ttfvSeconds?: number | null;
  ttfv_seconds?: number | null;
  ttfv?: number | null;

  support?: CustomerSafeSupportSummary | null;
  supportState?: string | null;
  support_state?: string | null;
  deploymentScope?: unknown;
  deploymentScopeSummary?: string | null;
  deployment_scope_summary?: string | null;
  readinessState?: string | null;
  readiness_state?: string | null;

  loStatus?: string | null;
  lo_status?: string | null;
  licensedScopeSummary?: string | null;
  licensed_scope_summary?: string | null;
  entitlementState?: string | null;
  entitlement_state?: string | null;
  entitlementExpiry?: string | null;
  entitlement_expiry?: string | null;
  entitlementExpiresAt?: string | null;

  expansionStatus?: string | null;
  expansionState?: string | null;
  expansion_state?: string | null;

  alphaAssessment?: CustomerSafeAlphaAssessment | null;
  alpha_assessment?: CustomerSafeAlphaAssessment | null;
  alphaCoreOpportunity?: boolean;
  alpha_core_opportunity?: boolean;
  alphaCoreState?: string | null;
  alpha_core_state?: string | null;
}

export interface NormalizedAlphaAssessment {
  eligibility: string | null;
  assessmentState: string | null;
  feeState: string | null;
  waiverState: string | null;
  entitlementState: string | null;
}

export interface NormalizedAstopSuccess {
  exists: boolean;
  progressionState: string | null;
  nextBestAction: string | null;
  nextRequiredAction: string | null;
  verifiedValueSummary: string | null;
  valueBasis: string | null;
  ttfvSeconds: number | null;
  invalidTtfv: boolean;
  supportState: string | null;
  deploymentScopeSummary: string | null;
  readinessState: string | null;
  loStatus: string | null;
  licensedScopeSummary: string | null;
  entitlementState: string | null;
  entitlementExpiry: string | null;
  expansionState: string | null;
  alphaAssessment: NormalizedAlphaAssessment | null;
  alphaCoreOpportunity: boolean;
  alphaCoreState: string | null;
}
