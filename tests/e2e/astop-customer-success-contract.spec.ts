import { expect, test } from '@playwright/test';
import { normalizeAstopSuccessProjection } from '../../src/lib/portal/astopSuccess';
import { getGovernedCta } from '../../src/lib/portal/governedNextAction';

test('authoritative customer-safe ASTOP projection preserves zero TTFV and strips protected fields', () => {
  const normalized = normalizeAstopSuccessProjection({
    customerSuccessActive: true,
    astopStage: 'LO_DEPLOYMENT',
    governedProgression: {
      currentMarketingStage: 'ASTOP',
      astopVerified: true,
      alphaComputeReady: false,
      alphaCoreReady: false,
      nextBestAction: 'open_alpha_compute_assessment',
    },
    governedNextBestAction: 'open_alpha_compute_assessment',
    nextRequiredAction: 'execute_license_out',
    ttfvSeconds: 0,
    verifiedValueStatus: 'verified',
    verifiedValueSummary: {
      verified: true,
      technical: {
        measured: { sourceMeasurement: 'MEASURED', available: true, value: 12 },
        estimated: { sourceMeasurement: 'ESTIMATED', available: false, value: null },
      },
      economic: { status: 'UNAVAILABLE', verified: false, value: null },
    },
    support: { openCount: 0, blockingOpenCount: 0 },
    deploymentScope: { product_scope: 'ASTOP', environments: ['production'] },
    loStatus: 'executed',
    entitlementState: 'active',
    entitlementExpiresAt: '2026-12-31T00:00:00Z',
    expansionStatus: 'not_recorded',
    // Runtime injection deliberately simulates a broader upstream object. The
    // normalizer has no path for these internal-plane fields into UI state.
    trustScore: 99,
    trustRationale: 'internal',
    iwlReasoning: 'internal',
    waiverPolicyCriteria: 'internal',
  } as never);

  expect(normalized.customerSuccessActive).toBe(true);
  expect(normalized.exists).toBe(true);
  expect(normalized.astopStage).toBe('LO_DEPLOYMENT');
  expect(normalized.progressionState).toBe('ASTOP');
  expect(normalized.nextBestAction).toBe('open_alpha_compute_assessment');
  expect(normalized.nextRequiredAction).toBe('execute_license_out');
  expect(normalized.ttfvSeconds).toBe(0);
  expect(normalized.verifiedValueSummary).toBe('12');
  expect(normalized.valueBasis).toBe('MEASURED');
  expect(normalized.deploymentScopeSummary).toBe('ASTOP · production');
  expect(normalized.entitlementState).toBe('active');
  expect(normalized.entitlementExpiry).toBe('2026-12-31T00:00:00Z');
  expect(normalized.expansionState).toBe('not_recorded');
  expect('trustScore' in normalized).toBe(false);
  expect('trustRationale' in normalized).toBe(false);
  expect('iwlReasoning' in normalized).toBe(false);
  expect('waiverPolicyCriteria' in normalized).toBe(false);
});

test('invalid negative TTFV is unavailable rather than coerced to zero', () => {
  const normalized = normalizeAstopSuccessProjection({ customerSuccessActive: true, ttfvSeconds: -1 });
  expect(normalized.ttfvSeconds).toBeNull();
  expect(normalized.invalidTtfv).toBe(true);
});

test('canonical CTA map translates real backend action vocabulary without inventing eligibility', () => {
  expect(getGovernedCta('execute_license_out', 'en')).toEqual({
    key: 'execute_license_out',
    href: '/workspace/messages',
    label: 'Complete the License-Out',
  });
  expect(getGovernedCta('open_alpha_compute_assessment', 'ko')).toEqual({
    key: 'open_alpha_compute_assessment',
    href: '/workspace/assessment',
    label: 'ALPHA Compute 평가 확인하기',
  });
  expect(getGovernedCta('none', 'en')).toBeNull();
  expect(getGovernedCta('future_backend_action', 'en')).toEqual({
    key: 'future_backend_action',
    href: '/workspace/messages',
    label: 'Review the next step with itriX',
  });
});
