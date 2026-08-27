import type { ImmediateResponse, PressureArea } from '@/types/review.types';
import type { QualificationAnswers } from '@/types/qualification.types';
import type { AppLocale } from '@/store/localeStore';

interface ApiError { detail: string; }
interface ApiResult<T> { data: T | null; error: ApiError | null; }
async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, cache: 'no-store', body: JSON.stringify(body) });
    const data = await res.json().catch(() => null) as T | { error?: ApiError } | null;
    if (!res.ok) return { data: null, error: (data as { error?: ApiError } | null)?.error ?? { detail: `Request failed (${res.status}).` } };
    return { data: data as T, error: null };
  } catch (e) { return { data: null, error: { detail: e instanceof Error ? e.message : 'Service unavailable.' } }; }
}

export interface SubmitReviewResponse { sessionId: string | null; immediateResponse: ImmediateResponse; }
export interface QualifyResponse { accepted: boolean; generationStatus: 'pending'|'ready'|'failed'; }
export interface ReviewStatusResponse { generationStatus: 'pending'|'ready'|'failed'; ready: boolean; accessCode?: string | null; retryable?: boolean; }

export const reviewApi = {
  submit: (input: { clientId?: string | null; sessionId?: string | null; prompt: string; selectedPressures: PressureArea[]; environment?: string | null; visitorType?: string | null; locale?: AppLocale }) =>
    postJson<SubmitReviewResponse>('/api/review/submit', input),
  qualify: (input: { sessionId: string; answers: QualificationAnswers }) => postJson<QualifyResponse>('/api/review/qualify', input),
  async resultStatus(sessionId: string): Promise<ApiResult<ReviewStatusResponse>> {
    try {
      const res = await fetch(`/api/review/${encodeURIComponent(sessionId)}/result-status`, { cache: 'no-store', headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => null) as ReviewStatusResponse | { error?: ApiError } | null;
      if (!res.ok) return { data: null, error: (data as { error?: ApiError } | null)?.error ?? { detail: `Status failed (${res.status}).` } };
      return { data: data as ReviewStatusResponse, error: null };
    } catch (e) { return { data: null, error: { detail: e instanceof Error ? e.message : 'Status unavailable.' } }; }
  },
  retryResult: (sessionId: string) => postJson<{ generationStatus: 'pending'|'ready'; ready: boolean }>(`/api/review/${encodeURIComponent(sessionId)}/result-status`, { action: 'retry' }),
  exchangeReviewAccess: (code: string) => postJson<{ ok: boolean }>('/api/client-page/access/exchange', { code }),
};
