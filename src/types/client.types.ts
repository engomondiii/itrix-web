/** Customer-safe My Review contract. Internal lead ids, tiers, scores, hidden persona
 * routing, relevance/confidence bands, product route and commercial pathway never cross
 * this boundary. */

export interface ProblemMirrorControl {
  action: 'confirm' | 'refine' | 'restart';
  label: string;
}

export interface StrategicProblemMirror {
  statedFacts: string[];
  affectedDecision: string;
  consequence: string;
  boundedHypothesis: string;
  unknowns: string[];
  confirmOrCorrect: string;
  controls?: ProblemMirrorControl[];
}

export interface DiagnosisRow {
  title: string;
  observation: string;
  interpretation: string;
  evidenceStatus?: string;
}

export interface KpiPreviewRow {
  label: string;
  metric: string;
}

export interface ProofPreviewRow {
  title: string;
  disclosure: 'public' | 'controlled_public' | 'nda_only' | string;
  reference?: string;
}

export interface ClientPage {
  problemMirror: StrategicProblemMirror;
  diagnosis: DiagnosisRow[];
  alphaFitSummary: string;
  kpiPreview: KpiPreviewRow[];
  proofPreview: ProofPreviewRow[];
  recommendedNextStep: string;
  generationStatus: 'pending' | 'ready' | 'failed';
  artifactFamily: string;
  artifactVersion: number;
  generatedAt: string;
  locale: string;
}

/** A minimal Client (portal account) reference. */
export interface ClientRef {
  id: string;
  leadId: string;
  email: string | null;
}

export interface Client {
  id: string;
  leadId: string;
  email: string;
  fullName: string | null;
  organization: string | null;
  role: string | null;
  ndaSigned: boolean;
  createdAt: string;
}

export interface InviteClaimResult {
  client: Client;
  requiresPasswordSet: boolean;
}
