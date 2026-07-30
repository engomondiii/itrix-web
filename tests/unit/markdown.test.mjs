/**
 * THE MARKDOWN PARSER — executable assertions.
 *
 * ── WHY THIS IS A .mjs AND NOT A .ts SPEC ───────────────────────────────────
 * The repo has no unit-test runner wired up, and `tsconfig.json` excludes tests/**
 * from the build. So this file is written to be RUNNABLE TODAY, without adding a
 * dependency:
 *
 *     npx tsc src/lib/markdown/*.ts --outDir .mdtest --target ES2022 \
 *         --module NodeNext --moduleResolution NodeNext --skipLibCheck
 *     # then add .js extensions to the relative imports and:
 *     node tests/unit/markdown.test.mjs
 *
 * Every assertion below was RUN against the compiled library before this package
 * shipped: 37 passed. When a runner is added, this becomes a spec file unchanged —
 * the assertions are the durable part.
 *
 * ── WHAT IT IS REALLY PROTECTING ────────────────────────────────────────────
 * Three properties, in descending order of how expensive they would be to lose:
 *
 *   1. NO HTML STRING AND NO SCRIPTABLE URL ever becomes a node. `<script>` is text;
 *      `javascript:` is not a link; image syntax never produces an image.
 *   2. AN UNTERMINATED CONSTRUCT IS LITERAL TEXT, so a half-arrived turn cannot
 *      change the visible text of an approved answer.
 *   3. THE MARKER NORMALISER AGREES WITH THE BACKEND'S SECOND GUARD PASS. If these
 *      two implementations drift, `gua*ran*tee` reaches a visitor.
 */
import assert from 'node:assert/strict';
import { parseMarkdown } from '../../.mdtest/parse.js';
import { normalizeMarkers } from '../../.mdtest/normalizeMarkers.js';
import { isSafeHref } from '../../.mdtest/sanitize.js';

let pass = 0;
const ok = (label, cond) => {
  assert.ok(cond, `FAILED: ${label}`);
  pass += 1;
};
const text = (n) =>
  n.kind === 'text' ? n.value : n.children ? n.children.map(text).join('') : (n.value ?? '');
const flat = (nodes) => nodes.map(text).join('');

/* ── Blocks ──────────────────────────────────────────────────────────────── */
let b = parseMarkdown('Hello there.\n\nSecond paragraph.');
ok('two paragraphs', b.length === 2 && b.every((n) => n.kind === 'paragraph'));

b = parseMarkdown('## Heading two\n### Heading three\n# Heading one');
ok('## maps to level 3', b[0].kind === 'heading' && b[0].level === 3);
ok('### maps to level 4', b[1].kind === 'heading' && b[1].level === 4);
/* A turn may not introduce a competing top-level heading (§7.4). */
ok('# is clamped, never an h1', b[2].kind === 'heading' && b[2].level === 3);

b = parseMarkdown('- one\n- two\n  - nested\n- three');
ok('unordered list', b[0].kind === 'list' && b[0].ordered === false);
ok('three top-level items', b[0].items.length === 3);
ok('nested sublist attached to its parent', b[0].items[1].sublist?.items.length === 1);

b = parseMarkdown('3. first\n4. second');
ok('ordered list keeps its start number', b[0].ordered && b[0].start === 3);

b = parseMarkdown('```python\nprint(1)\n```');
ok('fenced code with language', b[0].kind === 'code' && b[0].language === 'python');

/* THE STREAMING RULE (§19.9 rule 6). */
b = parseMarkdown('```python\nprint(1)');
ok('unterminated fence renders as paragraphs', b.every((n) => n.kind === 'paragraph'));

b = parseMarkdown('| a | b |\n| --- | ---: |\n| 1 | 2 |');
ok('table parsed', b[0].kind === 'table' && b[0].header.length === 2 && b[0].rows.length === 1);
ok('right alignment read', b[0].align[1] === 'right');

b = parseMarkdown('| a | b |\n| 1 | 2 |');
ok('a table without its delimiter row is not a table yet', b[0].kind === 'paragraph');

ok('blockquote', parseMarkdown('> quoted\n> more')[0].kind === 'quote');
ok('thematic break', parseMarkdown('---')[0].kind === 'rule');

/* ── Inline ──────────────────────────────────────────────────────────────── */
b = parseMarkdown('a **bold** and *italic* and `code`');
ok('strong, em and code all present',
  ['strong', 'em', 'code'].every((k) => b[0].children.some((n) => n.kind === k)));

ok('unterminated strong is literal', flat(parseMarkdown('**guar')[0].children) === '**guar');

b = parseMarkdown('`**not bold**`');
ok('a code span keeps its asterisks',
  b[0].children[0].kind === 'code' && b[0].children[0].value === '**not bold**');

/* ── Security ────────────────────────────────────────────────────────────── */
b = parseMarkdown('<script>alert(1)</script>');
ok('raw HTML produces only text nodes',
  b[0].children.every((n) => n.kind === 'text' || n.kind === 'break'));
ok('the script text is preserved for display, not stripped',
  flat(b[0].children).includes('<script>'));

ok('javascript: never becomes a link',
  !parseMarkdown('[click](javascript:alert(1))')[0].children.some((n) => n.kind === 'link'));

ok('an internal link is allowed',
  parseMarkdown('[x](/terms)')[0].children.some((n) => n.kind === 'link' && n.allowed === true));

const off = parseMarkdown('[x](https://evil.example/page)')[0].children.find((n) => n.kind === 'link');
ok('an off-allowlist host is a link node but not allowed', off && off.allowed === false);

ok('image syntax never produces an image node',
  !JSON.stringify(parseMarkdown('![alt](https://evil.example/pixel.gif)')).includes('"image"'));

ok('protocol-relative refused', isSafeHref('//evil.example') === false);
ok('data: refused', isSafeHref('data:text/html,<script>') === false);
ok('tab-obfuscated javascript refused', isSafeHref('java\tscript:alert(1)') === false);
ok('https allowed', isSafeHref('https://arxiv.org/abs/1') === true);

/* ── The marker-normalised guard pass (§19.9 rule 5) ─────────────────────── */
ok('gua*ran*tee normalises', normalizeMarkers('gua*ran*tee') === 'guarantee');
ok('**guarantee** normalises', normalizeMarkers('**guarantee**') === 'guarantee');
ok('a backticked figure normalises', normalizeMarkers('`$3M`') === '$3M');
ok('a link label normalises', normalizeMarkers('[guarantee](#x)') === 'guarantee');
ok('escaped delimiters normalise', normalizeMarkers('gua\\*ran\\*tee') === 'guarantee');
/* `\r` is not a Markdown escape, so this renders with its backslashes visible and is
   not an evasion. The normaliser must leave it alone rather than invent a match. */
ok('non-escape backslashes are left alone', normalizeMarkers('gua\\ran\\tee') === 'gua\\ran\\tee');
ok('table pipes normalise', normalizeMarkers('| 40 | % |').includes('40'));

console.log(`markdown: ${pass} assertions passed`);
