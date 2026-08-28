'use client';

import Link from 'next/link';
import { internalHref, linkHostLabel } from '@/lib/markdown/linkAllowlist';

/**
 * A link inside an assistant turn.
 *
 * ── A DISALLOWED LINK IS NOT REMOVED ────────────────────────────────────────
 * It renders as plain text with its URL visible (Architecture v2.7 §19.9 rule 4).
 * That is deliberate on both sides: deleting it would hide what the platform
 * suggested, and making it clickable would lend itriX's credibility to a
 * destination nobody approved. The visitor can see it, copy it, and decide.
 *
 * A permitted external link carries `rel="noopener noreferrer nofollow"` and shows
 * its host, so the destination is never a surprise. `nofollow` is there because a
 * model-generated link is not an editorial endorsement.
 *
 * Internal links use next/link so they behave like every other route on the
 * surface — including keeping the shell mounted.
 */
export interface ExternalLinkProps {
  href: string;
  allowed: boolean;
  children: React.ReactNode;
}

export function ExternalLink({ href, allowed, children }: ExternalLinkProps) {
  const copy = useCommonCopy();
  if (!allowed) {
    return (
      <span className="turn-link turn-link--blocked">
        {children}
        <span className="turn-link__url"> ({href})</span>
      </span>
    );
  }

  const internal = internalHref(href);
  if (internal) {
    return (
      <Link href={internal} className="turn-link">
        {children}
      </Link>
    );
  }

  const host = linkHostLabel(href);

  return (
    <a href={href} className="turn-link" target="_blank" rel="noopener noreferrer nofollow">
      {children}
      {host ? <span className="turn-link__host"> {host}</span> : null}
      <svg aria-hidden="true" viewBox="0 0 24 24" className="turn-link__icon" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 5h5v5M19 5l-7 7M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
      </svg>
      <span className="sr-only"> {copy.opensNewTab}</span>
    </a>
  );
}
