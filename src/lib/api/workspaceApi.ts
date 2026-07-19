/**
 * Browser-side typed client for the paid workspaces (States 7–9).
 *
 * Like every client on this surface it calls ONLY our same-origin
 * /api/portal/* route handlers, never Django directly, so the httpOnly
 * client-JWT stays server-side. Never throws: returns { data } | { error }.
 */

import type { ApiResult } from './journeyApi';
import type { AssessmentPayload, PoCEvidencePayload, IntegrationPayload } from '@/types/workspace.types';

async function getJson<T>(url: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!res.ok) return { data: null, error: `${url} ${res.status}` };
    return { data: (await res.json()) as T, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'unreachable' };
  }
}

export const workspaceApi = {
  assessment: () => getJson<AssessmentPayload>('/api/portal/evaluation'),
  pocEvidence: () => getJson<PoCEvidencePayload>('/api/portal/poc'),
  integration: () => getJson<IntegrationPayload>('/api/portal/success/plan'),
};
