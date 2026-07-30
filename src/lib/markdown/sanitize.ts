/**
 * Text-level hardening for parsed Markdown.
 *
 * The structural defence is in allowedNodes.ts — the parser emits data, the
 * renderer emits React elements, and no HTML string exists at any point. This
 * module handles the two things that survive that design.
 *
 * Architecture v2.7 §19.9 rules 3 and 4 · Surface 1 v6.0 §3.9
 */

/**
 * URL schemes that may never be linked, however the markup asks.
 *
 * `javascript:` is the obvious one. `data:` matters because a data URL can carry
 * an HTML document, and `vbscript:` because old engines honour it. `blob:` and
 * `filesystem:` are excluded for the same reason as `data:` — they reference
 * content nobody reviewed.
 */
const FORBIDDEN_SCHEMES = ['javascript:', 'data:', 'vbscript:', 'blob:', 'filesystem:', 'file:'];

/**
 * Normalise a href for scheme checking.
 *
 * Whitespace and control characters are stripped BEFORE the scheme test, because
 * `java\tscript:alert(1)` and `java\nscript:` are both honoured by some parsers
 * and neither matches a naive `startsWith`. Case is folded for the same reason.
 */
function canonicalise(href: string): string {
  return href.replace(/[\u0000-\u0020\u007f-\u009f]/g, '').toLowerCase();
}

/**
 * True when a href is structurally safe to put in an anchor.
 *
 * This is the SCHEME check only. Whether the destination is one itriX is willing
 * to point at is a separate decision, made in linkAllowlist.ts — a link can be
 * scheme-safe and still not allowed.
 */
export function isSafeHref(href: string): boolean {
  const c = canonicalise(href);
  if (!c) return false;
  if (FORBIDDEN_SCHEMES.some((s) => c.startsWith(s))) return false;
  /* Protocol-relative. `//evil.example` inherits https and reads as a path at a
     glance, which is exactly why it is refused rather than resolved. */
  if (c.startsWith('//')) return false;
  return c.startsWith('http://') || c.startsWith('https://') || c.startsWith('/') || c.startsWith('#');
}

/**
 * Strip characters that can misrepresent what a turn says.
 *
 * Bidirectional overrides are the reason this exists: U+202E and friends can make
 * rendered text read in a different order from the text a reviewer approved, which
 * turns a governed answer into an ungoverned one WITHOUT changing a single
 * character of the string the guard matched. Zero-width characters are stripped
 * for the related reason that they can split a word past a human reader.
 *
 * Tabs, newlines and ordinary whitespace are preserved — they are meaningful.
 */
export function stripUnsafeCharacters(text: string): string {
  return text
    .replace(/[\u202a-\u202e\u2066-\u2069\u200e\u200f\u061c]/g, '')
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
}

/**
 * Prepare raw model text for parsing.
 *
 * Line endings are normalised so the block scanner has one case to handle. No
 * HTML escaping happens here and none is needed: nothing downstream interprets
 * markup, and React escapes every text child it renders.
 */
export function prepareForParse(raw: string): string {
  return stripUnsafeCharacters(raw).replace(/\r\n?/g, '\n');
}
