/**
 * Navigation immediately after a session cookie is created.
 *
 * -- WHY THIS IS A HARD NAVIGATION AND NOT router.push() --------------------
 * Every path that signs somebody in does the same two things: POST to a route handler
 * that writes the client-JWT into an httpOnly cookie, then send them to /workspace.
 * Doing the second step with `router.push()` is broken, and it fails in a way that looks
 * like the login itself failed.
 *
 * The sequence that breaks:
 *
 *   1. an unauthenticated visitor opens /workspace. Middleware sees no cookie and
 *      redirects to /sign-in?next=/workspace. Next's CLIENT ROUTER CACHE stores the
 *      result of that navigation against the key /workspace, with staleTime 300 --
 *      five minutes.
 *   2. they sign in. The cookie is written by the route handler, so it is httpOnly and
 *      invisible to JS -- and invisible to the router cache, which has no idea that
 *      anything about the request has changed.
 *   3. `router.push('/workspace')` is a SOFT navigation. The router finds its cached
 *      entry for /workspace and replays it. That entry IS the redirect to sign-in.
 *
 * The visitor lands back on /sign-in?next=/workspace while holding a valid session, and
 * because the replayed entry is an RSC payload rather than a document, the browser can
 * end up rendering the raw flight data as plain text.
 *
 * A hard navigation fixes it at the root rather than papering over it:
 *
 *   - it discards the entire client router cache, so no stale middleware decision
 *     survives the transition;
 *   - middleware re-runs on the server with the new cookie actually attached;
 *   - it is deterministic. `router.refresh()` then `router.push()` is the other common
 *     answer, but refresh is asynchronous and the push can win the race -- which turns a
 *     reliable bug into an intermittent one.
 *
 * The cost is one full page load, at exactly one moment in a session. That is the right
 * trade for the transition where correctness matters most.
 *
 * -- WHY THE TARGET IS VALIDATED HERE --------------------------------------
 * `next` arrives from a query parameter, so it is attacker-controlled. Only same-origin
 * absolute paths under /workspace are honoured; anything else falls back. Without this a
 * crafted ?next=https://elsewhere.example turns our own sign-in page into an open
 * redirect that arrives carrying a freshly minted session.
 */

const DEFAULT_TARGET = '/workspace';

/**
 * Whether `next` is a safe same-origin workspace path.
 *
 * Rejects protocol-relative (`//host`) and backslash-prefixed forms, which some browsers
 * normalise into a host. A single leading slash followed by `workspace` is the only shape
 * accepted.
 */
export function isSafeAuthTarget(next: string | null | undefined): boolean {
  if (!next) return false;
  if (!next.startsWith('/')) return false;
  if (next.startsWith('//') || next.startsWith('/\\')) return false;
  return next === '/workspace' || next.startsWith('/workspace/') || next.startsWith('/workspace?');
}

/** Resolve the post-authentication destination. */
export function resolveAuthTarget(next?: string | null): string {
  return isSafeAuthTarget(next) ? (next as string) : DEFAULT_TARGET;
}

/**
 * Leave for the workspace with a full document load.
 *
 * `assign` rather than `replace`: the visitor came from a sign-in screen they may want to
 * return to if something is wrong, and replacing the entry removes that option.
 */
export function navigateAfterAuth(next?: string | null): void {
  const target = resolveAuthTarget(next);
  if (typeof window === 'undefined') return;
  window.location.assign(target);
}
