/**
 * Server-only Django fetch helper for the client plane.
 *
 * djangoFetch attaches the httpOnly client-JWT (when present) as a Bearer token and
 * forwards to Django. The token is read server-side only; browsers never see it.
 * Returns a normalized { ok, status, data } so route handlers stay tiny and never
 * leak backend errors verbatim.
 */
import 'server-only';
import { getClientAccessToken } from './session';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export interface DjangoResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
}

interface DjangoFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** When true, attaches the client-JWT (default true for portal calls). */
  authed?: boolean;
  /** Extra headers. */
  headers?: Record<string, string>;
}

export async function djangoFetch<T = unknown>(path: string, opts: DjangoFetchOptions = {}): Promise<DjangoResult<T>> {
  const { method = 'GET', body, authed = true, headers = {} } = opts;
  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';

  if (authed) {
    const token = await getClientAccessToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      cache: 'no-store',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let data: T | null = null;
    try {
      data = (await res.json()) as T;
    } catch {
      data = null;
    }
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

export { API_BASE };
