/**
 * Customer-visible ASTOP Customer Success projection.
 *
 * This file is intentionally a whitelist. It mirrors only fields emitted by the
 * backend Customer Success projection; internal trust, anti-abuse, security,
 * readiness rationale, IWL and waiver-policy reasoning have no representation here.
 */

export type GovernedNextAction = string | { key?: string | null; action?: string | null } | null;
export type CustomerSafeValue = string | number | boolean | null;

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

export interface CustomerSafeMetric {
  sourceMeasurement?: string | null;
  available?: boolean;
  value?: CustomerSafeValue;
}

export interface CustomerSafeVerifiedValueSummary {
  verified?: boolean;
  technical?: {
    measured?: CustomerSafeMetric;
    estimated?: CustomerSafeMetric;
  };
  economic?: {
    status?: string | null;
    verified?: boolean;
    sourceMeasurement?: string | null;
    value?: CustomerSafeValue;
    currency?: string | null;
    unit?: string | null;
    claimScope?: string | null;
  };
}

export interface CustomerSafeDeploymentScope {
  rights_type?: string | null;
  licensed_party?: string | null;
  business_unit?: string | null;
  product_scope?: string | null;
  field_of_use?: string | null;
  workload?: string | null;
  environments?: string | string[] | null;
  territory?: string | null;
  term?: string | null;
  deployment_scale?: string | null;
  deployment_scope?: string | string[] | null;
  redistribution?: string | boolean | null;
}

/** Exact browser-visible contract of GET /portal/success/astop/. */
export interface AstopSuccessProjection {
  customerSuccessActive?: boolean;
  astopStage?: string | null;
  ttfvSeconds?: number | null;
  verifiedValue?: boolean;
  verifiedValueStatus?: string | null;
  verifiedValueSummary?: CustomerSafeVerifiedValueSummary | null;
  governedProgression?: CustomerSafeProgression | null;
  governedNextBestAction?: GovernedNextAction;
  support?: CustomerSafeSupportSummary | null;
  deploymentScope?: CustomerSafeDeploymentScope | null;
  loStatus?: string | null;
  entitlementState?: string | null;
  entitlementExpiresAt?: string | null;
  expansionStatus?: string | null;
  nextRequiredAction?: string | null;
}

export interface NormalizedAstopSuccess {
  exists: boolean;
  customerSuccessActive: boolean;
  astopStage: string | null;
  progressionState: string | null;
  nextBestAction: string | null;
  nextRequiredAction: string | null;
  verifiedValueStatus: string | null;
  verifiedValueSummary: string | null;
  valueBasis: string | null;
  ttfvSeconds: number | null;
  invalidTtfv: boolean;
  supportState: string | null;
  deploymentScopeSummary: string | null;
  loStatus: string | null;
  entitlementState: string | null;
  entitlementExpiry: string | null;
  expansionState: string | null;
}
