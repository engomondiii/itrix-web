import type {
  AstopSuccessProjection,
  CustomerSafeAlphaAssessment,
  GovernedNextAction,
  NormalizedAlphaAssessment,
  NormalizedAstopSuccess,
  VerifiedValueProjection,
} from '@/types/astop-success.types';

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function actionKey(value: GovernedNextAction | undefined): string | null {
  if (typeof value === 'string') return text(value);
  if (!value || typeof value !== 'object') return null;
  return text(value.key) ?? text(value.action);
}

function verifiedValueSummary(value: VerifiedValueProjection | undefined): string | null {
  if (typeof value === 'string') return text(value);
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (!value || typeof value !== 'object') return null;

  const direct = text(value.summary) ?? text(value.display) ?? text(value.text);
  if (direct) return direct;

  const amount = value.value ?? value.amount;
  if ((typeof amount === 'number' && Number.isFinite(amount)) || typeof amount === 'string') {
    const rendered = String(amount).trim();
    if (!rendered) return null;
    const unit = text(value.unit);
    return unit ? `${rendered} ${unit}` : rendered;
  }
  return null;
}

function assessment(value: CustomerSafeAlphaAssessment | null | undefined): NormalizedAlphaAssessment | null {
  if (!value) return null;
  const normalized: NormalizedAlphaAssessment = {
    eligibility: text(value.eligibilityState) ?? text(value.eligibility_state) ?? text(value.eligibility),
    assessmentState: text(value.assessmentState) ?? text(value.assessment_state),
    feeState: text(value.feeState) ?? text(value.fee_state),
    waiverState: text(value.waiverState) ?? text(value.waiver_state),
    entitlementState: text(value.entitlementState) ?? text(value.entitlement_state) ?? text(value.entitlement),
  };
  return Object.values(normalized).some(Boolean) ? normalized : null;
}

/**
 * Normalize only explicitly customer-safe fields. Unknown keys are discarded rather
 * than forwarded, which is the client-side backstop against accidental internal-field
 * rendering if an upstream payload becomes broader later.
 */
export function normalizeAstopSuccessProjection(raw: AstopSuccessProjection): NormalizedAstopSuccess {
  const candidateTtfv = raw.ttfvSeconds ?? raw.ttfv_seconds ?? raw.ttfv ?? null;
  const validTtfv = typeof candidateTtfv === 'number' && Number.isFinite(candidateTtfv) && candidateTtfv >= 0;
  const value = raw.verifiedValue ?? raw.verified_value;
  const nestedBasis = value && typeof value === 'object'
    ? text(value.measurementBasis) ?? text(value.measurement_basis) ?? text(value.basis)
    : null;

  return {
    exists: raw.exists !== false,
    progressionState:
      text(raw.governedProgressionState) ??
      text(raw.governed_progression_state) ??
      text(raw.progressionState) ??
      text(raw.progression_state),
    nextBestAction: actionKey(raw.nextBestAction ?? raw.next_best_action),
    nextRequiredAction: text(raw.nextRequiredAction) ?? text(raw.next_required_action),
    verifiedValueSummary: verifiedValueSummary(value),
    valueBasis:
      text(raw.measurementBasis) ?? text(raw.measurement_basis) ?? text(raw.valueBasis) ?? text(raw.value_basis) ?? nestedBasis,
    ttfvSeconds: validTtfv ? candidateTtfv : null,
    invalidTtfv: typeof candidateTtfv === 'number' && candidateTtfv < 0,
    supportState: text(raw.supportState) ?? text(raw.support_state),
    deploymentScopeSummary: text(raw.deploymentScopeSummary) ?? text(raw.deployment_scope_summary),
    readinessState: text(raw.readinessState) ?? text(raw.readiness_state),
    loStatus: text(raw.loStatus) ?? text(raw.lo_status),
    licensedScopeSummary: text(raw.licensedScopeSummary) ?? text(raw.licensed_scope_summary),
    entitlementState: text(raw.entitlementState) ?? text(raw.entitlement_state),
    entitlementExpiry: text(raw.entitlementExpiry) ?? text(raw.entitlement_expiry),
    expansionState: text(raw.expansionState) ?? text(raw.expansion_state),
    alphaAssessment: assessment(raw.alphaAssessment ?? raw.alpha_assessment),
    alphaCoreOpportunity: raw.alphaCoreOpportunity === true || raw.alpha_core_opportunity === true,
    alphaCoreState: text(raw.alphaCoreState) ?? text(raw.alpha_core_state),
  };
}
