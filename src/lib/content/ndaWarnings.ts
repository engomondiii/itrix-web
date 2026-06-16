/**
 * Standard, on-message gating copy for content that sits behind the NDA boundary.
 * Keeps the public surface honest: public framing is shown, mechanism and numbers are not.
 */
export const NDA_WARNINGS = {
  benchmarks:
    'Specific benchmark figures are shared under NDA and validated per workload — public material stays at a conservative, structural level.',
  mechanism:
    'The underlying mechanism is described publicly only at a structural level. Implementation detail is available under NDA.',
  pricing:
    'Commercial terms are never quoted here. Pricing and licensing structure are handled directly by the team.',
  exclusivity:
    'Exclusive and strategic rights are scoped and priced case by case, after evaluation — not listed publicly.',
  results:
    'Any advantage is stated conditionally and confirmed through a proof-of-concept against an agreed baseline.',
} as const;

export type NdaWarningKey = keyof typeof NDA_WARNINGS;
