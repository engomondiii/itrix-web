import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CLIENT_COOKIE_NAMES } from '@/lib/server/session';

/**
 * Route-scoped client-JWT guard.
 *
 * Protects the authenticated portal workspace (/workspace/*). If no client
 * session cookie is present the visitor is redirected to sign-in with a `next`
 * param. The token is only PRESENCE-checked here (cheap, edge-safe); Django
 * re-verifies signature, audience and NDA ceiling on every API call, so this is
 * a UX guard, not the security boundary.
 *
 * The customized page /c/[token] is intentionally NOT guarded — it is gated by
 * its own capability token, which Django validates on fetch.
 *
 * PHASE 2 adds one thing: a bare /workspace lands on the state-appropriate
 * sub-route. It is a CONVENIENCE redirect and deliberately not an authorization
 * decision — the state hint is read from a non-sensitive cookie the backend sets
 * alongside the session, and if it is missing, malformed, or names a route the
 * visitor cannot reach, we fall through to /workspace and let the
 * backend decide what they see. A visitor cannot reach a surface by editing that
 * cookie, because the destination re-authorizes on every fetch.
 */
const STATE_HINT_COOKIE = 'itrix_state_key';

/** state_key → the sub-route that state most likely wants. */
const STATE_ROUTE: Record<string, string> = {
  nda: '/workspace',
  assessment: '/workspace',
  poc: '/workspace/poc',
  integration: '/workspace',
  'customer-success': '/workspace',
};

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  /* v5.0: a review is a THREAD. /review with no thread has nothing to restore,
     so it returns the visitor to the one place a conversation is created — the
     approved centre. A convenience redirect, not an authorization decision
     (Surface 1 v5.0 §1.1). */
  if (pathname === '/review' || pathname === '/review/') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  const hasSession = Boolean(req.cookies.get(CLIENT_COOKIE_NAMES.access)?.value);

  // Guard the workspace. (auth) pages under (portal) are public by design.
  if (pathname.startsWith('/workspace')) {
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = '/sign-in';
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }

    // Bare /workspace → the state-appropriate sub-route.
    if (pathname === '/workspace' || pathname === '/workspace/') {
      const hint = req.cookies.get(STATE_HINT_COOKIE)?.value ?? '';
      const url = req.nextUrl.clone();
      url.pathname = STATE_ROUTE[hint] ?? '/workspace';
      return NextResponse.redirect(url);
    }
  }

  // If already signed in, keep users out of the auth screens.
  if (hasSession && (pathname === '/sign-in' || pathname === '/set-password')) {
    const url = req.nextUrl.clone();
    url.pathname = '/workspace';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/review', '/workspace', '/workspace/:path*', '/sign-in', '/set-password'],
};
