/**
 * Browser-side typed client for the customer-success zone (State 10, and the
 * overlay from the first payment).
 *
 * Same-origin only. Never throws: returns { data } | { error }.
 *
 * One rule worth stating in code: nothing here sends a commercial signal, and
 * nothing here receives one. The improvement composer routes a request; it does
 * not open an opportunity.
 */

import type { ApiResult } from './journeyApi';
import type {
  SuccessOverview, Outcome, DeploymentHealth, SupportRequest, SuccessPlan,
  KnowledgeItem, ReleaseNote, ChangeEntry, RelationshipTeamMember,
  FeedbackPulseSubmission, FeedbackReceipt,
  ImprovementSubmission, ImprovementReceipt, SupportUrgency,
} from '@/types/success.types';

async function getJson<T>(url: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!res.ok) return { data: null, error: `${url} ${res.status}` };
    return { data: (await res.json()) as T, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'unreachable' };
  }
}

async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { data: null, error: `${url} ${res.status}` };
    return { data: (await res.json()) as T, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'unreachable' };
  }
}

export const successApi = {
  overview: () => getJson<SuccessOverview>('/api/portal/success/overview'),
  outcomes: () => getJson<{ outcomes: Outcome[] }>('/api/portal/success/outcomes'),
  deployments: () => getJson<{ deployments: DeploymentHealth[] }>('/api/portal/success/deployments'),
  support: () => getJson<{ requests: SupportRequest[]; slaHours: number | null }>('/api/portal/success/support'),
  plan: () => getJson<SuccessPlan>('/api/portal/success/plan'),
  knowledge: () => getJson<{ items: KnowledgeItem[]; releaseNotes: ReleaseNote[] }>('/api/portal/success/knowledge'),
  changes: (since?: string) =>
    getJson<{ changes: ChangeEntry[] }>(
      since ? `/api/portal/success/changes?since=${encodeURIComponent(since)}` : '/api/portal/success/changes',
    ),
  team: () => getJson<{ team: RelationshipTeamMember[] }>('/api/portal/success/team'),

  openSupportRequest: (subject: string, body: string, urgency: SupportUrgency) =>
    postJson<SupportRequest>('/api/portal/success/support', { subject, body, urgency }),

  /** Private. Goes to the customer-success owner and nowhere else. */
  submitPulse: (submission: FeedbackPulseSubmission) =>
    postJson<FeedbackReceipt>('/api/portal/success/feedback', submission),

  /** "What can we improve for you?" — routed, never triaged by the customer. */
  submitImprovement: (submission: ImprovementSubmission) =>
    postJson<ImprovementReceipt>('/api/portal/success/improve', submission),
};
