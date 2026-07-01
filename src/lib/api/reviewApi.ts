import type { ApiResponse, ApiError } from '@/types/api.types';
import type { PressureArea, ImmediateResponse } from '@/types/review.types';
import type { QualificationAnswers } from '@/types/qualification.types';
import type { ScoreBreakdown, LeadTier } from '@/types/lead.types';
import type { ProductRoute, LicensePathway } from '@/types/product.types';
import type { VisitorType } from '@/types/visitor.types';
import type { JourneyState } from '@/types/journey.types';

/** Same-origin POST helper. The Next route handlers under /api proxy to Django. */
export async function postJson<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const status = res.status;
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const error = (data as { error?: ApiError } | null)?.error ?? {
        detail: `Request failed (${status})`,
      };
      return { data: null, error, status };
    }
    return { data: (data as T) ?? null, error: null, status };
  } catch (e) {
    return {
      data: null,
      error: { detail: e instanceof Error ? e.message : 'Network error' },
      status: 0,
    };
  }
}

export interface SubmitReviewRequest {
  clientId?: string | null;
  sessionId?: string | null;
  prompt: string;
  selectedPressures: PressureArea[];
  environment: string | null;
  visitorType?: VisitorType | null;
}
export interface SubmitReviewResponse {
  sessionId: string | null;
  immediateResponse: ImmediateResponse;
}

export interface QualifyRequest {
  sessionId: string | null;
  clientId?: string | null;
  answers: QualificationAnswers;
}

/**
 * v3.0: qualify now also returns the client-page capability token + journey state,
 * because the backend advances the journey to DIAGNOSED and mints the token as part
 * of qualification. The old ResultPage flow (/api/review/result) is removed — the
 * personalized result is served through the token-gated /c/[token] page instead.
 */
export interface QualifyResponse {
  leadId: string | null;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  tier: LeadTier;
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
  capabilityToken: string | null;
  journeyState: JourneyState | null;
}

export const reviewApi = {
  submit: (req: SubmitReviewRequest) => postJson<SubmitReviewResponse>('/api/review/submit', req),
  qualify: (req: QualifyRequest) => postJson<QualifyResponse>('/api/review/qualify', req),
};
