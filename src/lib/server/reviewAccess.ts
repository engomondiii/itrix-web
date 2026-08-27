import 'server-only';
import { cookies } from 'next/headers';

export const VISITOR_SESSION_COOKIE = 'itrix_visitor_session';
export const REVIEW_ACCESS_COOKIE = 'itrix_review_access';
export const REVIEW_ACCESS_MAX_AGE = 2 * 60 * 60;

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export function visitorBindingFromRequest(req: Request): { value: string; created: boolean } {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.match(/(?:^|;\s*)itrix_visitor_session=([^;]+)/);
  if (match?.[1]) return { value: decodeURIComponent(match[1]).slice(0, 64), created: false };
  return { value: crypto.randomUUID(), created: true };
}

export async function getReviewAccessToken(): Promise<string | null> {
  return (await cookies()).get(REVIEW_ACCESS_COOKIE)?.value ?? null;
}

export async function getVisitorBinding(): Promise<string | null> {
  return (await cookies()).get(VISITOR_SESSION_COOKIE)?.value ?? null;
}

export function clearReviewAccess(response: import('next/server').NextResponse): void {
  response.cookies.set(REVIEW_ACCESS_COOKIE, '', { ...cookieOptions, maxAge: 0 });
}
