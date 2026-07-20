/**
 * The streaming indicator.
 *
 * A QUIET CARET. Not bouncing dots, not a shimmer sweep, not "itriX is
 * typing…" — nothing that implies a person is at the other end
 * (Architecture v2.6 §21.9).
 *
 * It is aria-hidden because the transcript's live region already announces the
 * settled turn. Announcing "loading" on every render would turn a screen reader
 * into a stutter.
 */
export function StreamCaret() {
  return <span className="turn__caret" aria-hidden="true" />;
}
