/**
 * Browser-side typed client for the portal. It ONLY ever calls our same-origin
 * /api/portal/* (and /api/accounts/*) route handlers — never Django directly — so
 * the httpOnly client-JWT stays server-side. Never throws; returns { data } | { error }.
 */

import type { ApiResult } from './journeyApi';
import type { ChatMessage } from '@/types/chat.types';
import type { InviteClaimResult } from '@/types/client.types';
import type {
  ClientIdentity,
  PortalOverview,
  PortalConversation,
  PortalThread,
  PortalBriefing,
  PortalDataRoom,
  PortalEvaluation,
  PortalNdaRequestPayload,
  PortalPoC,
  PortalNdaRequestResult,
  PortalSettings,
  PortalNotificationPrefs,
} from '@/types/portal.types';

async function getJson<T>(url: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!res.ok) return { data: null, error: `${url} ${res.status}` };
    return { data: (await res.json()) as T, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'unreachable' };
  }
}

async function sendJson<T>(url: string, body: unknown, method: 'POST' | 'PATCH' = 'POST'): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
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


async function requestNda(payload: PortalNdaRequestPayload): Promise<ApiResult<PortalNdaRequestResult>> {
  try {
    const res = await fetch('/api/portal/nda-request', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => null)) as PortalNdaRequestResult | null;
    if (res.status === 400 && body?.contextRequired) return { data: body, error: null };
    if (!res.ok) return { data: null, error: `/api/portal/nda-request ${res.status}` };
    return { data: body, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'unreachable' };
  }
}

export interface PortalLoginResult extends ApiResult<{ client: ClientIdentity }> {
  retryAfterSeconds: number | null;
}

function retryAfterSeconds(res: Response, body: unknown): number | null {
  const raw = res.headers.get('Retry-After');
  if (raw) {
    const seconds = Number.parseInt(raw, 10);
    if (Number.isFinite(seconds) && seconds > 0) return seconds;
    const date = Date.parse(raw);
    if (Number.isFinite(date)) return Math.max(1, Math.ceil((date - Date.now()) / 1000));
  }
  const fromBody = (body as { retryAfter?: unknown } | null)?.retryAfter;
  return typeof fromBody === 'number' && Number.isFinite(fromBody) && fromBody > 0 ? fromBody : null;
}

async function login(email: string, password: string): Promise<PortalLoginResult> {
  try {
    const res = await fetch('/api/portal/auth/login', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        data: null,
        error: res.status === 429 ? 'rate_limited' : `/api/portal/auth/login ${res.status}`,
        retryAfterSeconds: res.status === 429 ? retryAfterSeconds(res, body) : null,
      };
    }
    return { data: body as { client: ClientIdentity }, error: null, retryAfterSeconds: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : 'unreachable',
      retryAfterSeconds: null,
    };
  }
}

export const portalApi = {
  // --- auth ---
  /**
   * Claim an invitation (reveal ③).
   *
   * v8.0 adds `assent`: the instrument versions the visitor was SHOWN travel with the claim,
   * and `claim_invite()` writes the record inside the transaction that creates the Client
   * (Architecture v2.9 §19.10, R62). The page used to POST them separately to
   * `portal/legal/assent/` first — which produced a SECOND record, because the backend has
   * been recording one in-transaction since Backend v7.1 Phase 3.
   */
  claimInvite: (
    token: string,
    payload: {
      email?: string;
      password?: string;
      full_name?: string;
      organization?: string;
      role?: string;
      assent?: { slug: string; version: string; effective: string }[];
    },
  ) =>
    sendJson<InviteClaimResult>(`/api/accounts/invite/${encodeURIComponent(token)}/claim`, payload),
  login,
  logout: () => sendJson<{ ok: boolean }>(`/api/portal/auth/logout`, {}),
  me: () => getJson<ClientIdentity>(`/api/portal/auth/me`),

  // --- data ---
  overview: () => getJson<PortalOverview>(`/api/portal/overview`),
  conversations: () => getJson<PortalConversation[]>(`/api/portal/conversations`),
  conversationMessages: (id: string) =>
    getJson<PortalThread>(`/api/portal/conversations/${encodeURIComponent(id)}/messages`),
  sendMessage: (id: string, body: string, attachmentIds: string[] = []) =>
    sendJson<ChatMessage>(`/api/portal/conversations/${encodeURIComponent(id)}/messages`, { body, attachmentIds }),
  documents: () => getJson<PortalDataRoom>(`/api/portal/documents`),
  evaluation: () => getJson<PortalEvaluation>(`/api/portal/evaluation`),
  poc: () => getJson<PortalPoC>(`/api/portal/poc`),
  requestNda,
  settings: () => getJson<PortalSettings>(`/api/portal/settings`),
  saveProfile: (profile: Partial<PortalSettings['profile']>) =>
    sendJson<PortalSettings>(`/api/portal/settings`, { profile }, 'PATCH'),
  saveNotifications: (notifications: PortalNotificationPrefs) =>
    sendJson<PortalSettings>(`/api/portal/settings`, { notifications }, 'PATCH'),
  inviteTeammate: (email: string) =>
    sendJson<PortalSettings>(`/api/portal/settings`, { inviteEmail: email }, 'POST'),
  briefing: () => getJson<PortalBriefing>(`/api/portal/briefing`),
};
