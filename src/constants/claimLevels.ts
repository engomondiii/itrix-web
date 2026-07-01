/**
 * Claim-Card levels — display-only mirror of the backend 5-level approval matrix.
 * Surface 1 uses these to render governance state (e.g. "under review") and to
 * know that a message above the auto-approve threshold is held for a human.
 * All enforcement happens on the backend.
 */

export type ClaimLevel = 1 | 2 | 3 | 4 | 5;

export interface ClaimLevelInfo {
  level: ClaimLevel;
  kind: string;
  autoDeliver: boolean; // levels 1–2 auto-deliver (2 if cited); 3+ need a human
}

export const CLAIM_LEVELS: Record<ClaimLevel, ClaimLevelInfo> = {
  1: { level: 1, kind: 'Basic factual', autoDeliver: true },
  2: { level: 2, kind: 'Product capability', autoDeliver: true },
  3: { level: 3, kind: 'Technical / performance', autoDeliver: false },
  4: { level: 4, kind: 'Commercial / ROI', autoDeliver: false },
  5: { level: 5, kind: 'Legal / IP / license', autoDeliver: false },
};

/** Default auto-approve ceiling (mirrors backend AGENT_AUTO_APPROVE_MAX_LEVEL). */
export const AUTO_APPROVE_MAX_LEVEL: ClaimLevel = 2;

export function isAutoDeliverable(level: ClaimLevel): boolean {
  return level <= AUTO_APPROVE_MAX_LEVEL;
}
