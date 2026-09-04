import type {
  AstopSuccessProjection,
  CustomerSafeDeploymentScope,
  CustomerSafeValue,
  CustomerSafeVerifiedValueSummary,
  GovernedNextAction,
  NormalizedAstopSuccess,
} from '@/types/astop-success.types';

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function actionKey(value: GovernedNextAction | undefined): string | null {
  if (typeof value === 'string') return text(value);
  if (!value || typeof value !== 'object') return null;
  return text(value.key) ?? text(value.action);
}

function scalar(value: CustomerSafeValue | undefined): string | null {
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : null;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return text(value);
}

function withUnit(value: CustomerSafeValue | undefined, currency?: string | null, unit?: string | null): string | null {
  const rendered = scalar(value);
  if (rendered === null) return null;
  const suffix = [text(currency), text(unit)].filter((part, index, all): part is string => Boolean(part) && all.indexOf(part) === index);
  return suffix.length ? `${rendered} ${suffix.join(' ')}` : rendered;
}

function verifiedValue(summary: CustomerSafeVerifiedValueSummary | null | undefined): { display: string | null; basis: string | null } {
  if (!summary) return { display: null, basis: null };

  const economic = summary.economic;
  const economicValue = economic && text(economic.status)?.toUpperCase() !== 'UNAVAILABLE'
    ? withUnit(economic.value, economic.currency, economic.unit)
    : null;
  if (economicValue !== null) {
    return {
      display: economicValue,
      basis: text(economic?.sourceMeasurement) ?? text(economic?.status),
    };
  }

  const measured = summary.technical?.measured;
  if (measured?.available === true) {
    const display = scalar(measured.value);
    if (display !== null) return { display, basis: text(measured.sourceMeasurement) ?? 'MEASURED' };
  }

  const estimated = summary.technical?.estimated;
  if (estimated?.available === true) {
    const display = scalar(estimated.value);
    if (display !== null) return { display, basis: text(estimated.sourceMeasurement) ?? 'ESTIMATED' };
  }

  return { display: null, basis: null };
}

function scopeValue(value: string | string[] | boolean | null | undefined): string | null {
  if (Array.isArray(value)) {
    const items = value.map((item) => item.trim()).filter(Boolean);
    return items.length ? items.join(', ') : null;
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return text(value)?.replace(/_/g, ' ') ?? null;
}

function deploymentScopeSummary(scope: CustomerSafeDeploymentScope | null | undefined): string | null {
  if (!scope) return null;
  const ordered = [
    scope.product_scope,
    scope.business_unit,
    scope.field_of_use,
    scope.workload,
    scope.environments,
    scope.territory,
    scope.deployment_scale,
    scope.deployment_scope,
    scope.term,
  ];
  const values = ordered.map(scopeValue).filter((value): value is string => Boolean(value));
  return values.length ? values.join(' · ') : null;
}

function supportState(openCount: number | null | undefined, blockingOpenCount: number | null | undefined): string | null {
  if (typeof blockingOpenCount === 'number' && blockingOpenCount > 0) return 'blocking';
  if (typeof openCount === 'number' && openCount > 0) return 'open';
  if (openCount === 0 || blockingOpenCount === 0) return 'none';
  return null;
}

function requiredAction(value: string | null | undefined): string | null {
  const action = text(value);
  return action && action.toLowerCase() !== 'none' ? action : null;
}

/**
 * Normalize only the exact customer-safe ASTOP Customer Success projection. Unknown
 * backend keys are discarded by construction and cannot be forwarded into UI state.
 */
export function normalizeAstopSuccessProjection(raw: AstopSuccessProjection): NormalizedAstopSuccess {
  const candidateTtfv = raw.ttfvSeconds ?? null;
  const validTtfv = typeof candidateTtfv === 'number' && Number.isFinite(candidateTtfv) && candidateTtfv >= 0;
  const value = verifiedValue(raw.verifiedValueSummary);
  const nestedAction = text(raw.governedProgression?.nextBestAction);
  const directAction = actionKey(raw.governedNextBestAction);

  return {
    exists: raw.customerSuccessActive === true,
    customerSuccessActive: raw.customerSuccessActive === true,
    astopStage: text(raw.astopStage),
    progressionState: text(raw.governedProgression?.currentMarketingStage),
    nextBestAction: directAction ?? nestedAction,
    nextRequiredAction: requiredAction(raw.nextRequiredAction),
    verifiedValueStatus: text(raw.verifiedValueStatus),
    verifiedValueSummary: value.display,
    valueBasis: value.basis,
    ttfvSeconds: validTtfv ? candidateTtfv : null,
    invalidTtfv: typeof candidateTtfv === 'number' && candidateTtfv < 0,
    supportState: supportState(raw.support?.openCount, raw.support?.blockingOpenCount),
    deploymentScopeSummary: deploymentScopeSummary(raw.deploymentScope),
    loStatus: text(raw.loStatus),
    entitlementState: text(raw.entitlementState),
    entitlementExpiry: text(raw.entitlementExpiresAt),
    expansionState: text(raw.expansionStatus),
  };
}
