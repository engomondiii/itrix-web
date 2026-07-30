/**
 * THE CLOSED MARKDOWN VOCABULARY (Architecture v2.7 §19.9, Surface 1 v6.0 §3.9).
 *
 * Permitted, and nothing else:
 *   paragraphs · `##`/`###` headings · bold · italic · inline code ·
 *   fenced code with a language label · ordered, unordered and nested lists ·
 *   tables · blockquotes · thematic breaks · links
 *
 * Anything outside this set renders LITERALLY. A model that invents syntax
 * produces ugly text, never a security event.
 *
 * ── WHY THIS IS A NODE VOCABULARY AND NOT AN HTML ALLOW-LIST ────────────────
 *
 * The specification says "sanitise after parse against an allow-list of nodes and
 * attributes, so a parser bug is not a cross-site-scripting bug". The
 * implementation goes one step further and removes the class of bug entirely:
 * THE PARSER NEVER PRODUCES AN HTML STRING. It produces the plain data structures
 * below, and the renderer turns those into React elements.
 *
 * React escapes every text child. So `<script>alert(1)</script>` in model output
 * is not sanitised away — it is rendered, visibly, as those exact characters,
 * which is the correct behaviour for text a model wrote. There is no
 * `dangerouslySetInnerHTML` anywhere in the path, and `eslint-rules/no-dangerous-html.mjs`
 * fails the build if one appears.
 *
 * Two consequences worth stating because they are easy to lose in a refactor:
 *   1. A parser bug here can produce a WRONG RENDER. It cannot produce script
 *      execution, because there is no string→DOM step to exploit.
 *   2. Adding a node kind is a security decision, not a formatting one. The kind
 *      must be added to these unions AND given a renderer, or it does not appear.
 */

/** Inline nodes. `text` is the only leaf that carries characters. */
export type InlineNode =
  | { kind: 'text'; value: string }
  | { kind: 'strong'; children: InlineNode[] }
  | { kind: 'em'; children: InlineNode[] }
  | { kind: 'code'; value: string }
  | { kind: 'break' }
  /**
   * `allowed` is decided at parse time by linkAllowlist.ts. A disallowed link is
   * still a link NODE — it simply renders as plain text with its URL visible, so
   * the visitor can see what was suggested without the platform vouching for it.
   */
  | { kind: 'link'; href: string; allowed: boolean; children: InlineNode[] };

export interface ListItem {
  children: InlineNode[];
  /** One level of nesting. Deeper input flattens onto this level rather than recursing. */
  sublist?: { ordered: boolean; items: ListItem[] } | null;
}

/** Block nodes. */
export type BlockNode =
  | { kind: 'paragraph'; children: InlineNode[] }
  /** Mapped to h3/h4 by the renderer so a turn can never introduce a second h1. */
  | { kind: 'heading'; level: 3 | 4; children: InlineNode[] }
  | { kind: 'code'; language: string | null; value: string }
  | { kind: 'list'; ordered: boolean; start: number; items: ListItem[] }
  | { kind: 'table'; header: InlineNode[][]; rows: InlineNode[][][]; align: (Align | null)[] }
  | { kind: 'quote'; children: BlockNode[] }
  | { kind: 'rule' };

export type Align = 'left' | 'center' | 'right';

export const BLOCK_KINDS = ['paragraph', 'heading', 'code', 'list', 'table', 'quote', 'rule'] as const;
export const INLINE_KINDS = ['text', 'strong', 'em', 'code', 'break', 'link'] as const;

/** Runtime guard for the renderer's exhaustiveness check. */
export function isBlockKind(kind: string): kind is BlockNode['kind'] {
  return (BLOCK_KINDS as readonly string[]).includes(kind);
}
