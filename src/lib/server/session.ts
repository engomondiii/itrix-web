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
const PASSWORD_SET_COOKIE = 'itrix_password_set_cap';
const VERIFICATION_EMAIL_COOKIE = 'itrix_verification_email_hint';

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


/** Store the short-lived first-password capability after a valid invitation claim. */
export async function setPasswordSetCapability(token: string, maxAge = 60 * 60): Promise<void> {
  const jar = await cookies();
  jar.set(PASSWORD_SET_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

/** Consume-on-success is performed by Django; this getter keeps the capability server-only. */
export async function getPasswordSetCapability(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(PASSWORD_SET_COOKIE)?.value ?? null;
}

export async function clearPasswordSetCapability(): Promise<void> {
  const jar = await cookies();
  jar.delete(PASSWORD_SET_COOKIE);
}

/**
 * Keep the address from an enumeration-safe registration request available to the
 * server-side resend proxy. The browser never needs the address in a URL just to resend
 * the verification message, and the cookie itself reveals nothing about whether an
 * account was created or already existed.
 */
export async function setVerificationEmailHint(email: string, maxAge = 60 * 60 * 24): Promise<void> {
  const normalized = email.trim();
  if (!normalized) return;
  const jar = await cookies();
  jar.set(VERIFICATION_EMAIL_COOKIE, normalized, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function getVerificationEmailHint(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(VERIFICATION_EMAIL_COOKIE)?.value ?? null;
}

export async function clearVerificationEmailHint(): Promise<void> {
  const jar = await cookies();
  jar.delete(VERIFICATION_EMAIL_COOKIE);
}

/** Clear the client session (sign out). */
export async function clearClientSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export const CLIENT_COOKIE_NAMES = { access: ACCESS_COOKIE, refresh: REFRESH_COOKIE, passwordSet: PASSWORD_SET_COOKIE } as const;
