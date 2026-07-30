/**
 * The route's single `h1`, and its standfirst.
 *
 * ONE `h1` PER ROUTE (Surface 1 v7.0 §7.4). The arrival screen's `h1` is the main
 * question; every other route gets exactly one of its own, and the auth zone is no
 * exception. A panel with two headings is the easiest accessibility regression to
 * introduce and the least visible.
 *
 * The standfirst is optional, and where it exists it says something useful rather than
 * restating the heading. "Your conversation, your documents and your team are where you
 * left them" tells a returning customer what is behind the door; "Sign in below" would
 * not.
 */
export function AuthHeading({ title, standfirst }: { title: string; standfirst?: string }) {
  return (
    <header className="auth-heading">
      <h1 className="auth-heading__title">{title}</h1>
      {standfirst ? <p className="auth-heading__standfirst">{standfirst}</p> : null}
    </header>
  );
}
