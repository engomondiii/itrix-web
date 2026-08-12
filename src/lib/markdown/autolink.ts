/**
 * AUTOLINKING BARE URLS IN A PLAIN-TEXT TURN (fix, 2026-08-12).
 *
 * ── WHAT WAS BROKEN ─────────────────────────────────────────────────────────
 * `MarkdownTurn` has two paths. With `NEXT_PUBLIC_ENABLE_MARKDOWN_TURNS` on, links go
 * through the parser and `ExternalLink`. With the flag OFF — which is the default, and
 * what production runs — the body is rendered as `body.split('\n').map(line => <p>)`.
 * That produces no anchors at all, so every URL the platform sent, including the link
 * to a visitor's own personalised page, arrived as dead text they had to select and
 * paste by hand.
 *
 * The flag stays off. Its precondition is the backend's marker-normalised stream-guard
 * pass, and turning markdown on to get clickable links would enable a great deal more
 * than links. This module makes the plain-text path linkify, which is the actual ask.
 *
 * ── THE SAME ALLOW-LIST, DELIBERATELY ───────────────────────────────────────
 * Reuses `isAllowedLink` rather than trusting anything that matches a URL pattern. A
 * model can emit any URL, and a fabricated link that looks like a citation borrows the
 * platform's credibility for a destination nobody approved. A disallowed URL still
 * renders as visible text — the visitor sees exactly what was suggested and decides for
 * themselves.
 *
 * ── SAME-ORIGIN ABSOLUTE URLS BECOME INTERNAL ───────────────────────────────
 * The backend appends the personalised-page link as an ABSOLUTE url built from
 * FRONTEND_WEB_URL. Its host is our own, but `isAllowedLink` only auto-permits paths
 * beginning `/`, and the outbound host allow-list is env-configured and normally empty —
 * so our own link would have been treated as untrusted. Same-origin absolutes are
 * therefore rewritten to their path before the check, which both permits them and lets
 * them render through next/link like every other internal route.
 */

import { isAllowedLink } from './linkAllowlist';

/** A run of plain text, or a link found inside it. */
export type TextSegment =
  | { kind: 'text'; value: string }
  | { kind: 'link'; href: string; label: string; allowed: boolean };

/*
 * Matched greedily to whitespace, with sentence punctuation trimmed AFTERWARDS rather
 * than excluded from the pattern. This is load-bearing: a capability token is
 * `<payload>.<signature>` and contains a period, so a pattern that stopped at a dot
 * would cut a personalised-page link in half — the exact failure the transcript's
 * "Open your personalised page" button was written to route around.
 */
const URL_PATTERN = /https?:\/\/[^\s<>"']+|(?<![\w@.])\/(?:c|review|workspace|a)\/[^\s<>"']+/gi;
const TRAILING = /[.,;:!?)\]}'"\u201d\u2019]+$/;

/** Rewrite an absolute URL on our own origin to a root-relative path. */
function toInternalIfSameOrigin(href: string): string {
  if (!href.toLowerCase().startsWith('http')) return href;
  if (typeof window === 'undefined') return href;
  try {
    const url = new URL(href);
    if (url.origin !== window.location.origin) return href;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

/**
 * Split one line of plain text into text and link segments.
 *
 * Never throws and never drops characters: concatenating every segment's original text
 * reproduces the input exactly. A renderer can therefore not lose part of an approved
 * answer to a bad match.
 */
export function segmentText(line: string): TextSegment[] {
  const source = line ?? '';
  if (!source) return [];

  const segments: TextSegment[] = [];
  let cursor = 0;

  /* A fresh regex per call: /g patterns carry lastIndex, and a shared instance would
     make the result depend on what was rendered before it. */
  const pattern = new RegExp(URL_PATTERN.source, 'gi');
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    const raw = match[0];
    const trimmed = raw.replace(TRAILING, '');
    const trailing = raw.slice(trimmed.length);

    if (match.index > cursor) {
      segments.push({ kind: 'text', value: source.slice(cursor, match.index) });
    }

    const href = toInternalIfSameOrigin(trimmed);
    segments.push({
      kind: 'link',
      href,
      /* The label is the URL AS WRITTEN, never the rewritten href. A link whose visible
         text and destination differ is the shape of a phishing link, and the visitor
         should see what the platform actually said. */
      label: trimmed,
      allowed: isAllowedLink(href),
    });

    if (trailing) segments.push({ kind: 'text', value: trailing });
    cursor = match.index + raw.length;
  }

  if (cursor < source.length) {
    segments.push({ kind: 'text', value: source.slice(cursor) });
  }
  return segments;
}

/** Whether a line contains anything worth linkifying — lets callers skip the work. */
export function hasLink(line: string): boolean {
  return new RegExp(URL_PATTERN.source, 'i').test(line ?? '');
}
