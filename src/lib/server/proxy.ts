/**
 * Server-only Django fetch helper for the client plane.
 *
 * Client credentials remain in httpOnly cookies. An authenticated request that receives
 * a 401 gets exactly one server-side refresh attempt, then the original request is replayed
 * once. Authorization failures (403) are never refreshed.
 */
import 'server-only';
import { createHash } from 'node:crypto';
import {
  clearClientSession,
  getClientAccessToken,
  getClientRefreshToken,
  setClientSession,
} from './session';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export interface DjangoResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  /** Backend-provided rate-limit wait, in seconds, when present and valid. */
  retryAfter: number | null;
}

interface DjangoFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** When true, attaches the client-JWT (default true for portal calls). */
  authed?: boolean;
  headers?: Record<string, string>;
}

interface TokenRefreshPayload {
  access?: string;
  refresh?: string;
}

type RefreshOutcome =
  | { kind: 'ok'; access: string; refresh: string }
  | { kind: 'rejected' }
  | { kind: 'unavailable' };

/**
 * Coalesce refreshes for the same refresh credential without ever sharing credentials
 * across client sessions. The key is a one-way digest and the short-lived promise is
 * removed as soon as the backend refresh settles.
 */
const refreshFlights = new Map<string, Promise<RefreshOutcome>>();

function retryAfterSeconds(res: Response): number | null {
  const raw = res.headers.get('Retry-After');
  if (!raw) return null;
  const seconds = Number.parseInt(raw, 10);
  if (Number.isFinite(seconds) && seconds > 0) return seconds;
  const date = Date.parse(raw);
  if (Number.isFinite(date)) return Math.max(1, Math.ceil((date - Date.now()) / 1000));
  return null;
}

async function readResult<T>(res: Response): Promise<DjangoResult<T>> {
  let data: T | null = null;
  try {
    data = (await res.json()) as T;
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data, retryAfter: retryAfterSeconds(res) };
}

async function request<T>(path: string, opts: DjangoFetchOptions, accessToken: string | null): Promise<DjangoResult<T>> {
  const { method = 'GET', body, headers = {} } = opts;
  const finalHeaders: Record<string, string> = { Accept: 'application/json', ...headers };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';
  if (accessToken) finalHeaders.Authorization = `Bearer ${accessToken}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      cache: 'no-store',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return await readResult<T>(res);
  } catch {
    return { ok: false, status: 0, data: null, retryAfter: null };
  }
}

async function performRefresh(refresh: string): Promise<RefreshOutcome> {
  try {
    const res = await fetch(`${API_BASE}/client/auth/token/refresh/`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return { kind: 'rejected' };
    const payload = (await res.json().catch(() => null)) as TokenRefreshPayload | null;
    if (!payload?.access) return { kind: 'rejected' };
    return { kind: 'ok', access: payload.access, refresh: payload.refresh ?? refresh };
  } catch {
    return { kind: 'unavailable' };
  }
}

function refreshFlight(refresh: string): Promise<RefreshOutcome> {
  const key = createHash('sha256').update(refresh).digest('hex');
  const existing = refreshFlights.get(key);
  if (existing) return existing;

  const flight = performRefresh(refresh);
  refreshFlights.set(key, flight);
  void flight.finally(() => {
    if (refreshFlights.get(key) === flight) refreshFlights.delete(key);
  });
  return flight;
}

async function refreshSession(): Promise<string | null> {
  const refresh = await getClientRefreshToken();
  if (!refresh) return null;

  const outcome = await refreshFlight(refresh);
  if (outcome.kind === 'rejected') {
    await clearClientSession();
    return null;
  }
  if (outcome.kind === 'unavailable') {
    // A network outage is not proof the credential is invalid. Keep the cookies so a
    // later request may recover; the current request remains a normal auth failure.
    return null;
  }

  // Each request writes the rotated pair into its own response cookie context, even when
  // the backend refresh call itself was shared with another request for this same session.
  await setClientSession({ accessToken: outcome.access, refreshToken: outcome.refresh });
  return outcome.access;
}

export async function djangoFetch<T = unknown>(path: string, opts: DjangoFetchOptions = {}): Promise<DjangoResult<T>> {
  const authed = opts.authed !== false;
  const access = authed ? await getClientAccessToken() : null;
  const first = await request<T>(path, opts, access);
  if (!authed || first.status !== 401) return first;

  // Exactly one automatic refresh/replay. 403s and non-auth failures never enter here.
  const freshAccess = await refreshSession();
  if (!freshAccess) return first;
  return request<T>(path, opts, freshAccess);
}

export { API_BASE };
