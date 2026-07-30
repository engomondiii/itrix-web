/**
 * MARKER-STRIPPED NORMALISATION — the frontend mirror of the backend's second
 * stream-guard pass (Architecture v2.7 §19.9 rule 5, Backend v7.0 §6).
 *
 * ── WHY THIS EXISTS, AND WHY IT IS NOT THE ENFORCEMENT ──────────────────────
 *
 * The stream guard matches prohibited patterns against the raw token buffer. Once
 * assistant text is rendered as Markdown, markup can split a pattern past a
 * matcher that only ever sees raw text:
 *
 *     gua*ran*tee        renders as: guarantee
 *     `$3M`              renders as: $3M
 *     [guarantee](#)     renders as: guarantee
 *     gua\ran\tee        renders as: guarantee
 *
 * Each of those is exactly the string the guard exists to stop, and each passes a
 * naive raw-text match. So the backend matches every buffer TWICE — once raw, once
 * marker-stripped — before any parse and before any token reaches a client.
 *
 * THE ENFORCEMENT IS SERVER-SIDE. This module exists so that
 *   · tests can assert the two implementations agree, and
 *   · a development build can warn when text that would be caught by the
 *     normalised pass arrives anyway, which means the backend pass is not live and
 *     NEXT_PUBLIC_ENABLE_MARKDOWN_TURNS should not have been enabled.
 *
 * It must never be turned into a client-side filter. A frontend that quietly
 * rewrote a governed turn would be deciding what the visitor may read, which is
 * the one thing this architecture keeps on the server.
 */

/**
 * Strip Markdown syntax so the remaining text reads as it will be RENDERED.
 *
 * Order matters. Escapes go first (so `\*` becomes `*` and cannot be mistaken for
 * an emphasis marker), then link syntax (keeping the label, dropping the URL,
 * because the label is what a reader sees), then the delimiters.
 */
export function normalizeMarkers(input: string): string {
  return input
    /* Backslash escapes: keep the escaped character, drop the backslash. */
    .replace(/\\([\\`*_{}[\]()#+\-.!>~|])/g, '$1')
    /* Images and links: keep the visible label. */
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    /* Reference-style labels. */
    .replace(/!?\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    /* Autolinks. */
    .replace(/<((?:https?|mailto):[^>]+)>/g, '$1')
    /* Code spans, emphasis, strikethrough, and table pipes. */
    .replace(/[`*_~|]/g, '')
    /* Leading block markers, per line. */
    .replace(/^[ \t]*(?:>+[ \t]*|#{1,6}[ \t]+|[-+*][ \t]+|\d+\.[ \t]+)/gm, '');
}

/**
 * The prohibited patterns whose evasion this normalisation is for.
 *
 * A SMALL, EXPLICITLY PARTIAL MIRROR of the backend set, used only for the
 * development warning described above. It is deliberately not exhaustive: keeping
 * a full copy of the governance vocabulary in client code would create a second
 * place for it to drift, and would publish the list to anyone who reads the
 * bundle.
 */
const DEV_TRIPWIRE = [/guarantee/i, /\$\s?\d/, /\d+\s?x\s+faster/i, /\b\d{2,}\s?%/];

/**
 * Development-only check. Returns the pattern index that would have matched the
 * normalised text but not the raw text — i.e. evidence that the backend's
 * normalised pass is not live.
 */
export function markerEvasionSuspected(raw: string): number | null {
  if (process.env.NODE_ENV === 'production') return null;
  const normalised = normalizeMarkers(raw);
  for (let i = 0; i < DEV_TRIPWIRE.length; i += 1) {
    const p = DEV_TRIPWIRE[i];
    if (p.test(normalised) && !p.test(raw)) return i;
  }
  return null;
}
