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

    /* Bare /workspace -> the state-appropriate sub-route.

       ONLY WHEN THE DESTINATION ACTUALLY DIFFERS. This guard is not defensive
       tidiness; without it this block is an unconditional infinite redirect.

       v5.0 Phase 3 retired the workspace sub-routes and made /workspace itself the
       thread. STATE_ROUTE was rewritten to match, so every hint except `poc` now
       resolves to '/workspace' — and so does the `?? '/workspace'` fallback that
       covers a missing, empty or unrecognised cookie. The redirect therefore sent
       /workspace to /workspace: a 307 loop until the browser gave up with
       ERR_TOO_MANY_REDIRECTS.

       It stayed hidden because reaching it requires a client-JWT cookie. Nobody
       could sign in until outbound email started working, so the first successful
       login was also the first request that ever took this branch. */
    if (pathname === '/workspace' || pathname === '/workspace/') {
      const hint = req.cookies.get(STATE_HINT_COOKIE)?.value ?? '';
      const target = STATE_ROUTE[hint] ?? '/workspace';
      const here = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
      if (target !== here) {
        const url = req.nextUrl.clone();
        url.pathname = target;
        return NextResponse.redirect(url);
      }
      // Same destination: fall through and render the workspace.
    }
  }

  /* If already signed in, keep users out of the auth screens.

     v8.0 ADDS /sign-up, and it is not cosmetic: with open registration the route renders a
     real form, so a signed-in visitor reaching it could submit one and attempt to create a
     SECOND account — which the backend's one-address-one-account constraint would then have
     to refuse, producing a confusing failure for somebody who is already a customer (R63).

     /verify-email is deliberately NOT in this list. A signed-in person with an unconfirmed
     address is exactly who needs it. */
  if (hasSession && (pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/set-password')) {
    const url = req.nextUrl.clone();
    url.pathname = '/workspace';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/review', '/workspace', '/workspace/:path*', '/sign-in', '/sign-up', '/set-password'],
};
