import type { ReactNode } from 'react';

export interface StageAwareHeadingProps {
  /** The heading text for the current journey state. */
  children: ReactNode;
  /** Small technical label above the heading (mono, uppercase, tracked). */
  eyebrow?: string;
  /** Supporting sentence below the heading. */
  support?: ReactNode;
  /** `h1` on the first screen of a state; `h2` when nested. */
  as?: 'h1' | 'h2';
  id?: string;
}

/**
 * The heading at the top of the invariant centre, which changes with the
 * journey state while the surrounding shell stays put.
 *
 * Brand Manual §6: exactly one visually dominant message per screen. This is
 * that message. The eyebrow is a quiet technical label, never a second headline;
 * the support line is 2–4 sentences at most.
 *
 * It is a presentational component on purpose — the STATE decides the words, and
 * those words live in the content layer, not here.
 */
export function StageAwareHeading({ children, eyebrow, support, as = 'h1', id }: StageAwareHeadingProps) {
  const Heading = as;
  return (
    <header className="flex flex-col">
      {eyebrow ? (
        <p className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">{eyebrow}</p>
      ) : null}
      <Heading id={id} className={`${eyebrow ? 'mt-3' : ''} font-display text-web-h2 text-ink-primary`}>
        {children}
      </Heading>
      {support ? <div className="mt-3 max-w-reading text-web-body text-ink-secondary">{support}</div> : null}
    </header>
  );
}
