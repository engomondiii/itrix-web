/**
 * Inline Markdown → InlineNode[].
 *
 * Handles, and only handles: inline code, bold, italic, links, images (as links),
 * autolinks, hard line breaks, and backslash escapes.
 *
 * ── THE STREAMING RULE ──────────────────────────────────────────────────────
 * AN UNTERMINATED RUN RENDERS AS LITERAL TEXT (Architecture v2.7 §19.9 rule 6).
 * Mid-stream, `**guar` has no closing delimiter yet — so it renders as the four
 * characters `**gu` … and becomes bold the moment the closer arrives. The
 * alternative, optimistically opening a `<strong>` and hoping, produces a turn
 * whose formatting flickers as it arrives, and worse, means a half-delimiter can
 * change the visible text of an approved answer.
 *
 * Code spans are scanned FIRST, before emphasis, because the content of a code
 * span is literal by definition: `**not bold**` inside backticks must stay as
 * asterisks.
 */

import type { InlineNode } from './allowedNodes';
import { isAllowedLink } from './linkAllowlist';
import { isSafeHref } from './sanitize';

/** Merge adjacent text nodes so the tree has no runs of single characters. */
function pushText(out: InlineNode[], value: string): void {
  if (!value) return;
  const last = out[out.length - 1];
  if (last && last.kind === 'text') last.value += value;
  else out.push({ kind: 'text', value });
}

/** Find a closing delimiter, skipping escaped occurrences. Returns -1 if absent. */
function findClose(src: string, from: number, delim: string): number {
  let i = from;
  while (i <= src.length - delim.length) {
    if (src[i] === '\\') {
      i += 2;
      continue;
    }
    if (src.startsWith(delim, i)) return i;
    i += 1;
  }
  return -1;
}

export function parseInline(src: string): InlineNode[] {
  const out: InlineNode[] = [];
  let i = 0;

  while (i < src.length) {
    const ch = src[i];

    /* Backslash escape: the next character is literal, whatever it is. */
    if (ch === '\\' && i + 1 < src.length) {
      pushText(out, src[i + 1]);
      i += 2;
      continue;
    }

    /* Hard break: two or more trailing spaces before a newline. */
    if (ch === '\n') {
      out.push({ kind: 'break' });
      i += 1;
      continue;
    }

    /* Inline code — scanned before emphasis so its contents stay literal. */
    if (ch === '`') {
      /* Support runs of backticks so `` a`b `` works. */
      let ticks = 0;
      while (src[i + ticks] === '`') ticks += 1;
      const fence = '`'.repeat(ticks);
      const close = src.indexOf(fence, i + ticks);
      if (close === -1) {
        /* Unterminated: literal. */
        pushText(out, fence);
        i += ticks;
        continue;
      }
      out.push({ kind: 'code', value: src.slice(i + ticks, close).trim() });
      i = close + ticks;
      continue;
    }

    /* Image → LINK, never an <img> (Architecture v2.7 §19.9 rule 3). A model that
       can cause an outbound image request can exfiltrate the conversation into a
       URL, so image syntax is downgraded rather than honoured. */
    if (ch === '!' && src[i + 1] === '[') {
      const parsed = parseLinkAt(src, i + 1, true);
      if (parsed) {
        out.push(parsed.node);
        i = parsed.next;
        continue;
      }
      pushText(out, '!');
      i += 1;
      continue;
    }

    if (ch === '[') {
      const parsed = parseLinkAt(src, i, false);
      if (parsed) {
        out.push(parsed.node);
        i = parsed.next;
        continue;
      }
      pushText(out, '[');
      i += 1;
      continue;
    }

    /*
     * BARE AUTOLINK: a URL written straight into prose, with no angle brackets and
     * no [](). Added because a bare URL used to render as PLAIN TEXT — the visitor
     * had to select it by hand to open it, and the selection picked up whatever
     * punctuation followed.
     *
     * That was not a cosmetic problem. A capability token is
     * `<payload>.<signature>`, so it CONTAINS a period; a sentence's full stop
     * landing against the signature broke the token and the visitor was told their
     * review link had expired. TRAILING PUNCTUATION IS THEREFORE EXCLUDED FROM THE
     * HREF and pushed back as text, which is also what every other Markdown
     * renderer does with a sentence-final URL.
     */
    if ((ch === 'h' || ch === 'H') && /^https?:\/\//i.test(src.slice(i, i + 8))) {
      let end = i;
      while (end < src.length && !/[\s<>"']/.test(src[end])) end += 1;

      /* Give back sentence punctuation, and any closing bracket that has no opener
         inside the URL — `(https://x/a)` should not keep the `)`. */
      while (end > i) {
        const last = src[end - 1];
        if ('.,;:!?\u201d\u2019'.includes(last)) {
          end -= 1;
          continue;
        }
        if (last === ')' || last === ']' || last === '}') {
          const open = last === ')' ? '(' : last === ']' ? '[' : '{';
          const slice = src.slice(i, end - 1);
          if (slice.split(open).length <= slice.split(last).length) {
            end -= 1;
            continue;
          }
        }
        break;
      }

      const href = src.slice(i, end);
      if (href.length > 'https://'.length) {
        out.push({
          kind: 'link',
          href,
          allowed: isAllowedLink(href),
          children: [{ kind: 'text', value: href }],
        });
        i = end;
        continue;
      }
    }

    /* Autolink: <https://…> */
    if (ch === '<') {
      const close = src.indexOf('>', i + 1);
      const inner = close === -1 ? '' : src.slice(i + 1, close);
      if (close !== -1 && /^(https?:\/\/|mailto:)/i.test(inner)) {
        out.push({
          kind: 'link',
          href: inner,
          allowed: isAllowedLink(inner),
          children: [{ kind: 'text', value: inner }],
        });
        i = close + 1;
        continue;
      }
      /* Not an autolink. Literal — which is also how a stray HTML tag renders. */
      pushText(out, '<');
      i += 1;
      continue;
    }

    /* Bold: ** or __ */
    if ((ch === '*' || ch === '_') && src[i + 1] === ch) {
      const delim = ch + ch;
      const close = findClose(src, i + 2, delim);
      if (close === -1) {
        pushText(out, delim);
        i += 2;
        continue;
      }
      out.push({ kind: 'strong', children: parseInline(src.slice(i + 2, close)) });
      i = close + 2;
      continue;
    }

    /* Italic: * or _ */
    if (ch === '*' || ch === '_') {
      const close = findClose(src, i + 1, ch);
      /* An empty run (`**` handled above, `*` immediately closed) is literal. */
      if (close === -1 || close === i + 1) {
        pushText(out, ch);
        i += 1;
        continue;
      }
      out.push({ kind: 'em', children: parseInline(src.slice(i + 1, close)) });
      i = close + 1;
      continue;
    }

    pushText(out, ch);
    i += 1;
  }

  return out;
}

/** Parse `[label](href)` starting at the `[`. Returns null when incomplete. */
function parseLinkAt(
  src: string,
  start: number,
  image: boolean,
): { node: InlineNode; next: number } | null {
  const labelEnd = findClose(src, start + 1, ']');
  if (labelEnd === -1 || src[labelEnd + 1] !== '(') return null;

  const hrefEnd = src.indexOf(')', labelEnd + 2);
  if (hrefEnd === -1) return null;

  const label = src.slice(start + 1, labelEnd);
  /* Titles — [a](url "title") — are dropped: the title attribute is another place
     for unreviewed text to reach a tooltip, and it buys nothing here. */
  const href = src.slice(labelEnd + 2, hrefEnd).split(/\s+/)[0] ?? '';

  if (!isSafeHref(href)) {
    /* Scheme-unsafe: render the label and the URL as plain text so the visitor can
       see exactly what was suggested. Nothing becomes clickable. */
    const shown = image ? label || href : `${label} (${href})`;
    return { node: { kind: 'text', value: shown }, next: hrefEnd + 1 };
  }

  return {
    node: {
      kind: 'link',
      href,
      allowed: isAllowedLink(href),
      children: parseInline(label || href),
    },
    next: hrefEnd + 1,
  };
}
