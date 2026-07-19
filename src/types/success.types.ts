/**
 * Customer-success types — State 10, and the overlay that begins at the FIRST
 * PAYMENT (Architecture v2.5 §7).
 *
 * The dividing line these types encode:
 *
 *   CUSTOMER-VISIBLE  agreed outcomes, status, work completed, support SLA, open
 *                     actions, owners, meetings, documents, deployment health,
 *                     training, feedback history.
 *   INTERNAL-ONLY     commercial probability, churn risk, account priority,
 *                     margin, negotiation posture, competitor risk, objection
 *                     classification, persona, tier, health CLASS.
 *
 * Only the first list appears below. The customer sees the factual components a
 * health signal is derived from — never the signal itself.
 */

/* ── Outcomes ───────────────────────────────────────────────────────────────── */

/** Exactly these four words, everywhere (Playbook v1.5 §12B). */
export type OutcomeStatus = 'on_plan' | 'at_risk' | 'off_plan' | 'achieved';

export interface Outcome {
  id: string;
  title: string;
  description: string | null;
  /** What is being measured, in the customer's terms. */
  metric: string | null;
  baseline: string | null;
  target: string | null;
  current: string | null;
  status: OutcomeStatus;
  owner: string | null;
  dueAt: string | null;
}

/* ── Deployment health ──────────────────────────────────────────────────────── */

export interface DeploymentHealth {
  environment: string;
  status: 'stable' | 'degraded' | 'incident' | 'unknown';
  lastCheckedAt: string | null;
  version: string | null;
  incidents30d: number;
  /** Stated by us, before they are discovered. */
  knownLimitations: string[];
}

/* ── Support ────────────────────────────────────────────────────────────────── */

export type SupportStatus = 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved';
export type SupportUrgency = 'low' | 'normal' | 'high' | 'critical';

export interface SupportRequest {
  id: string;
  subject: string;
  body: string | null;
  urgency: SupportUrgency;
  status: SupportStatus;
  owner: string | null;
  slaDueAt: string | null;
  openedAt: string;
  resolvedAt: string | null;
  /** Asked only after resolution, and only once. */
  resolutionFeedback: string | null;
}

/* ── Changes since last visit ───────────────────────────────────────────────── */

export type ChangeKind = 'work_completed' | 'issue_resolved' | 'update' | 'decision_needed';

export interface ChangeEntry {
  id: string;
  kind: ChangeKind;
  summary: string;
  occurredAt: string;
}

/* ── Success plan ───────────────────────────────────────────────────────────── */

export interface SuccessPlanMilestone {
  id: string;
  label: string;
  owner: string | null;
  /** Dependencies are named on BOTH sides, so nothing is a surprise. */
  ownerSide: 'itrix' | 'customer';
  dueAt: string | null;
  status: 'not_started' | 'in_progress' | 'complete' | 'blocked';
}

export interface SuccessPlan {
  horizonDays: 30 | 60 | 90;
  goals: string[];
  milestones: SuccessPlanMilestone[];
  nextReviewAt: string | null;
}

/* ── Knowledge & training ───────────────────────────────────────────────────── */

export interface KnowledgeItem {
  id: string;
  title: string;
  kind: 'training' | 'documentation' | 'practice';
  /** Role-based, so a customer sees what is relevant to their team. */
  audience: string | null;
  href: string | null;
  durationMinutes: number | null;
}

export interface ReleaseNote {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  appliesToVersions: string[];
}

/* ── Relationship team ──────────────────────────────────────────────────────── */

export type TeamRole = 'customer_success' | 'technical' | 'executive' | 'support';

export interface RelationshipTeamMember {
  id: string;
  name: string;
  role: TeamRole;
  /** What they handle — stated, so the customer never has to guess who to ask. */
  expectations: string;
  isPrimary: boolean;
}

/* ── Feedback ───────────────────────────────────────────────────────────────── */

export interface FeedbackPulseSubmission {
  score: 1 | 2 | 3 | 4 | 5;
  freeText?: string;
  followUpRequested?: boolean;
}

/** What we echo back after a pulse. Deliberately NOT the score as a judgement. */
export interface FeedbackReceipt {
  received: true;
  followUpRequested: boolean;
  ownerName: string | null;
}

/* ── The improvement composer ───────────────────────────────────────────────── */

export type ImprovementRoute = 'support' | 'outcome' | 'training' | 'human';

export interface ImprovementSubmission {
  message: string;
}

export interface ImprovementReceipt {
  route: ImprovementRoute;
  owner: string | null;
  /** Confirmation of where it went. The customer never finds the department. */
  acknowledgement: string;
}

/* ── The aggregate overview ─────────────────────────────────────────────────── */

export interface SuccessOverview {
  /** True from the first payment — the overlay, not the full State 10 home. */
  overlayActive: boolean;
  /** True once a contract is executed. */
  homeActive: boolean;
  outcomes: Outcome[];
  deployments: DeploymentHealth[];
  openSupport: SupportRequest[];
  changesSince: ChangeEntry[];
  plan: SuccessPlan | null;
  team: RelationshipTeamMember[];
  supportSlaHours: number | null;
  nextSuccessReviewAt: string | null;
}
