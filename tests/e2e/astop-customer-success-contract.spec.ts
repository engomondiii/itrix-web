import { expect, test } from '@playwright/test';
import { normalizeAstopSuccessProjection } from '../../src/lib/portal/astopSuccess';
import { getGovernedCta } from '../../src/lib/portal/governedNextAction';

test('customer-safe ASTOP projection preserves zero TTFV and strips protected fields', () => {
  const normalized = normalizeAstopSuccessProjection({
    governed_progression_state: 'deployment_ready',
    next_best_action: 'review_entitlement',
    ttfv_seconds: 0,
    verified_value: { value: 12, unit: '%', basis: 'measured' },
    entitlement_state: 'active',
    entitlement_expiry: '2026-12-31T00:00:00Z',
    // Deliberately inject fields that exist only on internal planes. The normalizer
    // accepts the object at runtime but has nowhere to carry them into UI state.
    trustScore: 99,
    trustRationale: 'internal',
    iwlReasoning: 'internal',
    waiverPolicyCriteria: 'internal',
  } as never);

  expect(normalized.ttfvSeconds).toBe(0);
  expect(normalized.verifiedValueSummary).toBe('12 %');
  expect(normalized.valueBasis).toBe('measured');
  expect(normalized.entitlementState).toBe('active');
  expect('trustScore' in normalized).toBe(false);
  expect('trustRationale' in normalized).toBe(false);
  expect('iwlReasoning' in normalized).toBe(false);
  expect('waiverPolicyCriteria' in normalized).toBe(false);
});

test('invalid negative TTFV is unavailable rather than coerced to zero', () => {
  const normalized = normalizeAstopSuccessProjection({ ttfvSeconds: -1 });
  expect(normalized.ttfvSeconds).toBeNull();
  expect(normalized.invalidTtfv).toBe(true);
});

test('frontend only translates a backend-governed next action', () => {
  expect(getGovernedCta('review_entitlement', 'en')).toEqual({
    key: 'review_entitlement',
    href: '/workspace/messages',
    label: 'Review entitlement',
  });
  expect(getGovernedCta('invent_alpha_core_eligibility', 'en')).toBeNull();
});
