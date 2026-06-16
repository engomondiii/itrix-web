import type { ProductRoute, LicensePathway, TechnologyId } from './product.types';
import type { LeadTier, ScoreBreakdown } from './lead.types';
import type { PressureArea } from './review.types';

/** Personalized result page — section payloads (mirrors backend result_page builders). */

export interface DiagnosisRow {
  pressure: PressureArea;
  observation: string;
  itrixInterpretation: string;
  alphaRole: string;
}

export interface KpiPreviewItem {
  label: string;
  metric: string; // approved, hedged language only
}

export interface ProofPreviewItem {
  title: string;
  disclosure: 'public' | 'nda_only';
  reference?: string; // public reference (e.g. arXiv) when disclosure is public
}

export interface ResultPage {
  leadId: string;
  tier: LeadTier;
  scoreBreakdown: ScoreBreakdown;
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
  primaryTechnologies: TechnologyId[];
  problemMirror: string;
  diagnosis: DiagnosisRow[];
  alphaFitSummary: string;
  kpiPreview: KpiPreviewItem[];
  proofPreview: ProofPreviewItem[];
  recommendedNextStep: string;
}
