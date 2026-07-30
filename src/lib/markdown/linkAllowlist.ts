/**
 * WHICH DESTINATIONS A TURN MAY LINK TO (Architecture v2.7 §19.9 rule 4).
 *
 * A link resolves only to an itriX route or a host on the approved outbound list.
 * Anything else renders as plain text with its URL visible — the visitor sees what
 * was suggested, and the platform does not vouch for it by making it clickable.
 *
 * ── WHY AN ALLOW-LIST RATHER THAN A BLOCK-LIST ──────────────────────────────
 * A model can emit any URL. Some of those are the model's own invention, and a
 * fabricated link that LOOKS like a citation is worse than no link: it borrows the
 * platform's credibility for a destination nobody approved. So the default is "not
 * clickable", and each permitted host is a decision someone made.
 *
 * Configured by NEXT_PUBLIC_MARKDOWN_LINK_ALLOWED_HOSTS — a comma-separated list.
 * Subdomains are matched, so `arxiv.org` covers `www.arxiv.org`, and only on a dot
 * boundary, so it does NOT cover `notarxiv.org`.
 */

import { isSafeHref } from './sanitize';

function configuredHosts(): string[] {
  const raw = process.env.NEXT_PUBLIC_MARKDOWN_LINK_ALLOWED_HOSTS ?? '';
  return raw
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

/** An itriX route: same-origin, and not a protocol-relative URL in disguise. */
export function isInternalHref(href: string): boolean {
  return (href.startsWith('/') && !href.startsWith('//')) || href.startsWith('#');
}

export function isAllowedLink(href: string): boolean {
  if (!isSafeHref(href)) return false;
  if (isInternalHref(href)) return true;

  let host: string;
  try {
    host = new URL(href).hostname.toLowerCase();
  } catch {
    /* Unparseable. Not a link we are willing to put a visitor through. */
    return false;
  }

  return configuredHosts().some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

/** Shown beside a permitted external link so the destination is never a surprise. */
export function linkHostLabel(href: string): string | null {
  if (isInternalHref(href)) return null;
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
