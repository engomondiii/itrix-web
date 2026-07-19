/**
 * Paid-workspace types — States 7, 8 and 9 (Surface 1 v4.0 §4).
 *
 * Client-side mirror of the backend evaluation / PoC / integration projections.
 * The backend is authoritative; these shapes describe what the client-JWT
 * endpoints return AFTER the serializer allow-list has stripped every internal
 * field (Architecture v2.5 §10.5). Nothing here has a place for persona_id,
 * tier, score, license-out probability, churn risk or negotiation posture — the
 * UI cannot leak what the type cannot hold.
 */

/* ── State 7 · Alpha Compute Assessment ─────────────────────────────────────── */

export type AssessmentStage =
  | 'intake' | 'baseline' | 'boundary_map' | 'feasibility' | 'benchmark_design' | 'recommendation';

export interface AssessmentStep {
  stage: AssessmentStage;
  label: string;
  status: 'not_started' | 'in_progress' | 'complete';
  owner: string | null;
  /** What the CUSTOMER needs to do, if anything. */
  actionRequired: string | null;
  completedAt: string | null;
}

/**
 * One section of the Boundary Waste Map.
 *
 * QUALITATIVE ONLY. The map describes where representational waste appears to
 * sit and why; it never carries a measured speed-up, a saving, or any number
 * that would read as a performance claim before a PoC has produced evidence
 * (Playbook §19.5 — no unapproved benchmark numbers).
 */
export interface BoundaryWasteSection {
  key: string;
  title: string;
  /** Prose. Any figure here would be an unapproved claim. */
  finding: string;
  /** A qualitative read, never a percentage. */
  significance: 'low' | 'moderate' | 'high';
  confidence: 'preliminary' | 'supported' | 'strong';
}

export interface AssessmentPayload {
  exists: boolean;
  stage: AssessmentStage;
  steps: AssessmentStep[];
  workloadSummary: string | null;
  baselineSummary: string | null;
  boundaryWasteMap: BoundaryWasteSection[];
  feasibilityNotes: string | null;
  benchmarkDesign: string | null;
  pocRecommendation: string | null;
  nextMilestone: { label: string; owner: string | null; dueAt: string | null } | null;
}

/* ── State 8 · Paid PoC ─────────────────────────────────────────────────────── */

/**
 * A PoC outcome. THREE values, and only three.
 *
 *   "Evidence is transparent and no outcome is reinterpreted after the fact."
 *
 * There is deliberately no 'promising', 'directional' or 'partial success'.
 * A negative result is reported as negative; the credibility of every future
 * itriX claim depends on that being true the first time it is inconvenient.
 */
export type KpiOutcome = 'pass' | 'partial' | 'negative' | 'pending';

export interface PoCKpi {
  id: string;
  label: string;
  /** The criterion agreed BEFORE the run. Shown beside the result, always. */
  passCriterion: string;
  partialCriterion: string | null;
  baseline: string | null;
  observed: string | null;
  outcome: KpiOutcome;
  measuredAt: string | null;
  notes: string | null;
}

export interface PoCEvidencePayload {
  exists: boolean;
  workloadScope: string | null;
  baselineSummary: string | null;
  benchmarkProtocol: string | null;
  kpis: PoCKpi[];
  decisionSummary: string | null;
  /** Set only once both sides have walked the findings together. */
  agreedAt: string | null;
}

/* ── State 9 · Integration & license-out ────────────────────────────────────── */

export interface ReadinessItem {
  key: string;
  label: string;
  status: 'not_started' | 'in_progress' | 'complete' | 'blocked';
  owner: string | null;
  note: string | null;
}

export interface CommercialDocument {
  id: string;
  title: string;
  kind: 'loi' | 'lo' | 'license' | 'sow' | 'other';
  status: 'draft' | 'in_review' | 'signed';
  updatedAt: string;
  href: string | null;
}

export interface DecisionEntry {
  id: string;
  summary: string;
  decidedBy: string;
  decidedAt: string;
  /** True when the decision is still open and awaiting the customer. */
  awaitingCustomer: boolean;
}

export interface IntegrationPayload {
  exists: boolean;
  readiness: ReadinessItem[];
  acceptedEvidence: string[];
  openDecisions: DecisionEntry[];
  decisionLog: DecisionEntry[];
  documents: CommercialDocument[];
}
