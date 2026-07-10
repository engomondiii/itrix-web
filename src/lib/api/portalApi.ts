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
  PortalPoC,
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

export const portalApi = {
  // --- auth ---
  claimInvite: (
    token: string,
    payload: {
      email?: string;
      password?: string;
      full_name?: string;
      organization?: string;
      role?: string;
    },
  ) =>
    sendJson<InviteClaimResult>(`/api/accounts/invite/${encodeURIComponent(token)}/claim`, payload),
  login: (email: string, password: string) =>
    sendJson<{ client: ClientIdentity }>(`/api/portal/auth/login`, { email, password }),
  logout: () => sendJson<{ ok: boolean }>(`/api/portal/auth/logout`, {}),
  me: () => getJson<ClientIdentity>(`/api/portal/auth/me`),

  // --- data ---
  overview: () => getJson<PortalOverview>(`/api/portal/overview`),
  conversations: () => getJson<PortalConversation[]>(`/api/portal/conversations`),
  conversationMessages: (id: string) =>
    getJson<PortalThread>(`/api/portal/conversations/${encodeURIComponent(id)}/messages`),
  sendMessage: (id: string, body: string) =>
    sendJson<ChatMessage>(`/api/portal/conversations/${encodeURIComponent(id)}/messages`, { body }),
  documents: () => getJson<PortalDataRoom>(`/api/portal/documents`),
  evaluation: () => getJson<PortalEvaluation>(`/api/portal/evaluation`),
  poc: () => getJson<PortalPoC>(`/api/portal/poc`),
  settings: () => getJson<PortalSettings>(`/api/portal/settings`),
  saveProfile: (profile: Partial<PortalSettings['profile']>) =>
    sendJson<PortalSettings>(`/api/portal/settings`, { profile }, 'PATCH'),
  saveNotifications: (notifications: PortalNotificationPrefs) =>
    sendJson<PortalSettings>(`/api/portal/settings`, { notifications }, 'PATCH'),
  inviteTeammate: (email: string) =>
    sendJson<PortalSettings>(`/api/portal/settings`, { inviteEmail: email }, 'POST'),
  briefing: () => getJson<PortalBriefing>(`/api/portal/briefing`),
};
