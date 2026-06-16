import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScoreBreakdown, LeadTier } from '@/types/lead.types';
import type { ProductRoute, LicensePathway } from '@/types/product.types';
import type { ResultPage } from '@/types/result.types';

export interface ScoringSnapshot {
  leadId: string | null;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  tier: LeadTier;
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
}

interface LeadState {
  leadId: string | null;
  totalScore: number | null;
  scoreBreakdown: ScoreBreakdown | null;
  tier: LeadTier | null;
  productRoute: ProductRoute | null;
  licensePathway: LicensePathway | null;
  result: ResultPage | null;
  emailCaptured: boolean;

  setScoring: (snapshot: ScoringSnapshot) => void;
  setLeadId: (leadId: string | null) => void;
  setResult: (result: ResultPage | null) => void;
  setEmailCaptured: (captured: boolean) => void;
  reset: () => void;
}

const initial = {
  leadId: null,
  totalScore: null,
  scoreBreakdown: null,
  tier: null,
  productRoute: null,
  licensePathway: null,
  result: null,
  emailCaptured: false,
} as const;

export const useLeadStore = create<LeadState>()(
  persist(
    (set) => ({
      ...initial,
      setScoring: (s) =>
        set({
          leadId: s.leadId,
          totalScore: s.totalScore,
          scoreBreakdown: s.scoreBreakdown,
          tier: s.tier,
          productRoute: s.productRoute,
          licensePathway: s.licensePathway,
        }),
      setLeadId: (leadId) => set({ leadId }),
      setResult: (result) => set({ result }),
      setEmailCaptured: (emailCaptured) => set({ emailCaptured }),
      reset: () => set({ ...initial }),
    }),
    { name: 'itrix-lead' },
  ),
);
