/**
 * Block-level Markdown → BlockNode[]. The public entry point of the renderer.
 *
 * Closed feature set (Architecture v2.7 §19.9 rule 1): paragraphs, `##`/`###`
 * headings, fenced code with a language label, ordered/unordered/nested lists,
 * tables, blockquotes, thematic breaks. Everything else is a paragraph.
 *
 * ── THE TWO RULES THAT SHAPE THIS SCANNER ───────────────────────────────────
 *
 * 1. AN UNTERMINATED CONSTRUCT RENDERS AS LITERAL TEXT UNTIL IT CLOSES (rule 6).
 *    A fence with no closer is not optimistically opened as a code block: its
 *    lines render as paragraphs, and become a code block the moment the closing
 *    fence arrives. Same for a table without its delimiter row.
 *
 *    This costs one visible transition per construct, mid-stream. The alternative
 *    costs a turn whose layout thrashes while it arrives, and — worse — means a
 *    half-written delimiter can change the visible text of an approved answer.
 *    The specification chose stability; so does this.
 *
 * 2. HEADINGS ARE CLAMPED TO h3/h4. `#` and `##` both become level 3, `###` and
 *    deeper become level 4. The platform's single h1 is the arrival question
 *    (Surface 1 v6.0 §7.4), and a turn must not be able to introduce a competing
 *    top-level heading.
 */

import type { Align, BlockNode, InlineNode, ListItem } from './allowedNodes';
import { parseInline } from './inline';
import { prepareForParse } from './sanitize';

const FENCE = /^(?:```|~~~)\s*([A-Za-z0-9+#._-]*)\s*$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const RULE = /^(?:\s*[-*_]\s*){3,}$/;
const QUOTE = /^>\s?(.*)$/;
const UL_ITEM = /^(\s*)[-+*]\s+(.*)$/;
const OL_ITEM = /^(\s*)(\d+)[.)]\s+(.*)$/;
const TABLE_DELIM = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/;

export function parseMarkdown(raw: string): BlockNode[] {
  const lines = prepareForParse(raw).split('\n');
  return parseBlocks(lines);
}

function parseBlocks(lines: string[]): BlockNode[] {
  const out: BlockNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i += 1;
      continue;
    }

    /* ── Fenced code ──────────────────────────────────────────────────────── */
    const fence = FENCE.exec(line);
    if (fence) {
      const marker = line.trim().startsWith('~~~') ? '~~~' : '```';
      let end = -1;
      for (let j = i + 1; j < lines.length; j += 1) {
        if (lines[j].trim().startsWith(marker)) {
          end = j;
          break;
        }
      }
      if (end === -1) {
        /* Rule 1: unterminated. Every remaining line becomes a paragraph, the
           fence line included, so nothing is hidden inside a block that has not
           been closed yet. */
        for (let j = i; j < lines.length; j += 1) {
          if (lines[j].trim() !== '') out.push({ kind: 'paragraph', children: parseInline(lines[j]) });
        }
        return out;
      }
      out.push({
        kind: 'code',
        language: fence[1] ? fence[1].toLowerCase() : null,
        value: lines.slice(i + 1, end).join('\n'),
      });
      i = end + 1;
      continue;
    }

    /* ── Thematic break ───────────────────────────────────────────────────── */
    if (RULE.test(line)) {
      out.push({ kind: 'rule' });
      i += 1;
      continue;
    }

    /* ── Heading ──────────────────────────────────────────────────────────── */
    const heading = HEADING.exec(line);
    if (heading) {
      out.push({
        kind: 'heading',
        level: heading[1].length <= 2 ? 3 : 4,
        children: parseInline(heading[2].trim()),
      });
      i += 1;
      continue;
    }

    /* ── Blockquote ───────────────────────────────────────────────────────── */
    if (QUOTE.test(line)) {
      const inner: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        inner.push(QUOTE.exec(lines[i])![1]);
        i += 1;
      }
      out.push({ kind: 'quote', children: parseBlocks(inner) });
      continue;
    }

    /* ── Table ────────────────────────────────────────────────────────────── */
    if (line.includes('|') && i + 1 < lines.length && TABLE_DELIM.test(lines[i + 1])) {
      const header = splitRow(lines[i]);
      const align = readAlignment(lines[i + 1], header.length);
      const rows: InlineNode[][][] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].includes('|') && lines[j].trim() !== '') {
        rows.push(splitRow(lines[j]).map(parseInline));
        j += 1;
      }
      out.push({ kind: 'table', header: header.map(parseInline), rows, align });
      i = j;
      continue;
    }

    /* ── List ─────────────────────────────────────────────────────────────── */
    if (UL_ITEM.test(line) || OL_ITEM.test(line)) {
      const parsed = parseList(lines, i);
      out.push(parsed.block);
      i = parsed.next;
      continue;
    }

    /* ── Paragraph ────────────────────────────────────────────────────────── */
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !FENCE.test(lines[i]) &&
      !HEADING.test(lines[i]) &&
      !RULE.test(lines[i]) &&
      !QUOTE.test(lines[i]) &&
      !UL_ITEM.test(lines[i]) &&
      !OL_ITEM.test(lines[i])
    ) {
      paragraph.push(lines[i]);
      i += 1;
    }
    out.push({ kind: 'paragraph', children: parseInline(paragraph.join('\n')) });
  }

  return out;
}

/**
 * One list, with at most one level of nesting.
 *
 * Deeper input FLATTENS onto the sublist rather than recursing without limit. A
 * turn is prose with structure, not a document outline, and an unbounded nesting
 * depth is an unbounded indentation budget inside a 68-character measure.
 */
function parseList(lines: string[], start: number): { block: BlockNode; next: number } {
  const first = OL_ITEM.exec(lines[start]);
  const ordered = Boolean(first);
  const startNumber = first ? Number.parseInt(first[2], 10) || 1 : 1;
  const baseIndent = (first ? first[1] : UL_ITEM.exec(lines[start])![1]).length;

  const items: ListItem[] = [];
  let i = start;

  while (i < lines.length) {
    const ul = UL_ITEM.exec(lines[i]);
    const ol = OL_ITEM.exec(lines[i]);
    if (!ul && !ol) break;

    const indent = (ul ? ul[1] : ol![1]).length;
    const text = ul ? ul[2] : ol![3];

    if (indent > baseIndent) {
      /* Nested. Attach to the last item, creating the sublist on first sight. */
      const parent = items[items.length - 1];
      if (!parent) {
        items.push({ children: parseInline(text), sublist: null });
      } else {
        if (!parent.sublist) parent.sublist = { ordered: Boolean(ol), items: [] };
        parent.sublist.items.push({ children: parseInline(text), sublist: null });
      }
      i += 1;
      continue;
    }

    if (indent < baseIndent) break;

    items.push({ children: parseInline(text), sublist: null });
    i += 1;
  }

  return { block: { kind: 'list', ordered, start: startNumber, items }, next: i };
}

function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  /* Split on unescaped pipes only, so `\|` can appear inside a cell. */
  const cells: string[] = [];
  let current = '';
  for (let i = 0; i < trimmed.length; i += 1) {
    if (trimmed[i] === '\\' && trimmed[i + 1] === '|') {
      current += '|';
      i += 1;
      continue;
    }
    if (trimmed[i] === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += trimmed[i];
  }
  cells.push(current.trim());
  return cells;
}

function readAlignment(line: string, columns: number): (Align | null)[] {
  const cells = splitRow(line);
  const out: (Align | null)[] = [];
  for (let i = 0; i < columns; i += 1) {
    const cell = (cells[i] ?? '').trim();
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    out.push(left && right ? 'center' : right ? 'right' : left ? 'left' : null);
  }
  return out;
}
