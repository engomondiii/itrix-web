import type { ApiResponse, ApiError } from '@/types/api.types';
import type { PressureArea, ImmediateResponse } from '@/types/review.types';
import type { QualificationAnswers } from '@/types/qualification.types';
import type { ScoreBreakdown, LeadTier } from '@/types/lead.types';
import type { ProductRoute, LicensePathway } from '@/types/product.types';
import type { VisitorType } from '@/types/visitor.types';
import type { ResultPage } from '@/types/result.types';

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
export interface QualifyResponse {
  leadId: string | null;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  tier: LeadTier;
  productRoute: ProductRoute;
  licensePathway: LicensePathway | null;
}

export interface ResultRequest {
  leadId: string | null;
  sessionId?: string | null;
  answers?: QualificationAnswers;
}

export const reviewApi = {
  submit: (req: SubmitReviewRequest) => postJson<SubmitReviewResponse>('/api/review/submit', req),
  qualify: (req: QualifyRequest) => postJson<QualifyResponse>('/api/review/qualify', req),
  result: (req: ResultRequest) => postJson<ResultPage>('/api/review/result', req),
};
