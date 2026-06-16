import type { ProductRoute, LicensePathway } from './product.types';

/** Lead tiers — derived from total score (mirrors backend scoring.tier_classifier). */
export type LeadTier = 1 | 2 | 3 | 4;

/** The five scoring categories (weights total 100). */
export type ScoringCategory =
  | 'strategic_fit'
  | 'technical_fit'
  | 'urgency'
  | 'budget_authority'
  | 'license_potential';

export type ScoreBreakdown = Record<ScoringCategory, number>;

/** Lead lifecycle — 12 statuses (mirrors backend apps.leads.Lead.status). */
export type LeadStatus =
  | 'new'
  | 'reviewing'
  | 'qualified'
  | 'contacted'
  | 'meeting_scheduled'
  | 'nda_sent'
  | 'nda_signed'
  | 'evaluation'
  | 'poc'
  | 'negotiation'
  | 'won'
  | 'archived';

/** Special commercial rights — 7 types (mirrors backend special-rights set). */
export type SpecialRight =
  | 'exclusivity'
  | 'field_exclusivity'
  | 'regional_exclusivity'
  | 'right_of_first_refusal'
  | 'source_access'
  | 'co_development'
  | 'strategic_partnership';

export interface Lead {
  id: string;
  company: string | null;
  contactName: string | null;
  email: string | null;
  tier: LeadTier;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
  status: LeadStatus;
  specialRights: SpecialRight[];
  createdAt: string;
}
