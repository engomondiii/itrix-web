'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLeadStore } from '@/store/leadStore';
import type { ScoreBreakdown, LeadTier } from '@/types/lead.types';
import type { ProductRoute, LicensePathway } from '@/types/product.types';
import type { ResultPage } from '@/types/result.types';
import type { JourneyState } from '@/types/journey.types';

interface LeadContextValue {
  leadId: string | null;
  totalScore: number | null;
  scoreBreakdown: ScoreBreakdown | null;
  tier: LeadTier | null;
  productRoute: ProductRoute | null;
  licensePathway: LicensePathway | null;
  result: ResultPage | null;
  emailCaptured: boolean;
  capabilityToken: string | null;
  journeyState: JourneyState | null;
  setEmailCaptured: (captured: boolean) => void;
}

const LeadContext = createContext<LeadContextValue | null>(null);

/** Exposes computed lead state (score, tier, route, result) plus the v3.0
 *  capability token + journey state to the /review segment. */
export function LeadProvider({ children }: { children: ReactNode }) {
  const s = useLeadStore();
  const value: LeadContextValue = {
    leadId: s.leadId,
    totalScore: s.totalScore,
    scoreBreakdown: s.scoreBreakdown,
    tier: s.tier,
    productRoute: s.productRoute,
    licensePathway: s.licensePathway,
    result: s.result,
    emailCaptured: s.emailCaptured,
    capabilityToken: s.capabilityToken,
    journeyState: s.journeyState,
    setEmailCaptured: s.setEmailCaptured,
  };
  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLead(): LeadContextValue {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLead must be used within a LeadProvider');
  return ctx;
}
