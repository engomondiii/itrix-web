/**
 * Server-only client-JWT session helpers (httpOnly cookies).
 *
 * The client-JWT NEVER touches client-side JS: it is stored in an httpOnly, secure,
 * sameSite cookie set by our route handlers and read only on the server when
 * proxying to Django. This keeps the token out of reach of XSS and keeps the client
 * plane cleanly separated from the anonymous + team planes (Architecture §3.1).
 *
 * import 'server-only' guarantees this module can never be pulled into a client
 * bundle by mistake.
 */
import 'server-only';
import { cookies } from 'next/headers';

const ACCESS_COOKIE = 'itrix_client_at';
const REFRESH_COOKIE = 'itrix_client_rt';

const isProd = process.env.NODE_ENV === 'production';

interface SetSessionArgs {
  accessToken: string;
  refreshToken?: string | null;
  /** access-token lifetime in seconds (default 30 min). */
  maxAge?: number;
}

/** Persist the client-JWT pair in httpOnly cookies (call from a route handler). */
export async function setClientSession({ accessToken, refreshToken, maxAge = 1800 }: SetSessionArgs): Promise<void> {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
  if (refreshToken) {
    jar.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });
  }
}

/** Read the current client access token (server-only). */
export async function getClientAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}

/** Read the current client refresh token (server-only). */
export async function getClientRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE)?.value ?? null;
}

/** True when a client session cookie is present (used by middleware/guards). */
export async function hasClientSession(): Promise<boolean> {
  return (await getClientAccessToken()) !== null;
}

/** Clear the client session (sign out). */
export async function clearClientSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export const CLIENT_COOKIE_NAMES = { access: ACCESS_COOKIE, refresh: REFRESH_COOKIE } as const;
