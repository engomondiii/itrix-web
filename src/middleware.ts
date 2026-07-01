import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CLIENT_COOKIE_NAMES } from '@/lib/server/session';

/**
 * Route-scoped client-JWT guard.
 *
 * Protects the authenticated portal workspace (/workspace/*). If no client session
 * cookie is present, the visitor is redirected to the portal sign-in with a `next`
 * param so they return to where they were headed. The token is only PRESENCE-checked
 * here (cheap, edge-safe); Django re-verifies the JWT signature + audience + NDA
 * ceiling on every API call, so the middleware is a UX guard, not the security
 * boundary.
 *
 * The customized page /c/[token] is intentionally NOT guarded here — it is gated by
 * its own capability token, which Django validates on fetch.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const hasSession = Boolean(req.cookies.get(CLIENT_COOKIE_NAMES.access)?.value);

  // Guard the workspace. (auth) pages under (portal) are public by design.
  if (pathname.startsWith('/workspace')) {
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = '/sign-in';
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
  }

  // If already signed in, keep users out of the auth screens.
  if (hasSession && (pathname === '/sign-in' || pathname === '/set-password')) {
    const url = req.nextUrl.clone();
    url.pathname = '/workspace/overview';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/:path*', '/sign-in', '/set-password'],
};
