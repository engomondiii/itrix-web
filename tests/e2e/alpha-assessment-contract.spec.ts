import { expect, test } from '@playwright/test';
import { alphaAssessmentFacts, safeTtfvSeconds } from '../../src/lib/portal/evaluationPresentation';
import type { PortalEvaluation } from '../../src/types/portal.types';

function evaluation(overrides: Partial<PortalEvaluation> = {}): PortalEvaluation {
  return {
    exists: true,
    kind: 'alpha_compute',
    stage: 'scoping',
    reportHref: null,
    ...overrides,
  };
}

test('fee waiver never synthesizes ALPHA technical eligibility or entitlement', () => {
  const facts = alphaAssessmentFacts(evaluation({ customerFeeStatus: 'waived', waiverState: 'granted' }));
  expect(facts.feeState).toBe('waived');
  expect(facts.waiverState).toBe('granted');
  expect(facts.eligibility).toBeNull();
  expect(facts.entitlementState).toBeNull();
  expect(facts.assessmentState).toBe('scoping');
});

test('customer-safe ALPHA dimensions remain separate when all are provided', () => {
  const facts = alphaAssessmentFacts(evaluation({
    eligibility_state: 'eligible',
    assessment_state: 'in_progress',
    fee_state: 'paid',
    waiver_state: 'not_applicable',
    entitlement_state: 'pending',
  }));
  expect(facts).toEqual({
    eligibility: 'eligible',
    assessmentState: 'in_progress',
    feeState: 'paid',
    waiverState: 'not_applicable',
    entitlementState: 'pending',
  });
});

test('TTFV accepts legitimate zero and rejects invalid negative ordering', () => {
  expect(safeTtfvSeconds(0)).toBe(0);
  expect(safeTtfvSeconds(-1)).toBeNull();
  expect(safeTtfvSeconds(Number.NaN)).toBeNull();
});
