import { expect, test } from '@playwright/test';

/**
 * RENDERED MARKDOWN, SAFELY (R40, R41, Architecture v2.7 §19.9).
 *
 * The parser is covered exhaustively by tests/unit/markdown.test.mjs, which was RUN
 * against the compiled library (37 assertions). This file asserts the properties that
 * only exist once the output reaches a real DOM:
 *
 *   · script text is VISIBLE CHARACTERS, not an executed script;
 *   · a disallowed link is not an anchor;
 *   · a table scrolls inside the turn instead of widening the page;
 *   · an unterminated fence resolves cleanly when it closes.
 */

const BODY = [
  '## What we heard',
  '',
  'Your **inference cost** is rising. Here is a `metric` and a [link](/terms).',
  '',
  '- one',
  '- two',
  '',
  '| region | share |',
  '| --- | ---: |',
  '| apac | 40 |',
  '',
  '```python',
  'print("hello")',
  '```',
  '',
  'Not a link: [x](javascript:alert(1)) and not an image: ![p](https://evil.example/p.gif)',
  '',
  'Literal markup: <script>alert(1)</script>',
].join('\n');

async function stub(page: import('@playwright/test').Page, body: string) {
  await page.route('**/api/shell*', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        shellMode: 'working', journeyState: 2,
        conversationRailSections: ['new_chat', 'conversations', 'account'],
        contentPaneSections: [],
        conversationHeader: { title: 'Review', stateLabel: 'Review', quickHelp: false },
      }),
    }),
  );
  await page.route('**/api/threads/thr_md', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'thr_md', title: 'Review',
        createdAt: new Date().toISOString(), lastActivityAt: new Date().toISOString(),
        turns: [
          { id: 't1', senderKind: 'visitor', body: 'Our inference cost is rising.', seq: 1, status: 'settled' },
          { id: 't2', senderKind: 'agent', body, seq: 2, status: 'settled' },
        ],
        artifacts: [], cards: [],
      }),
    }),
  );
}

test('structure renders as structure, not as asterisks and pipes', async ({ page }) => {
  await stub(page, BODY);
  await page.goto('/review/thr_md');

  const turn = page.locator('.turn--itrix .turn-markdown');
  await expect(turn.locator('h3')).toHaveText('What we heard');
  await expect(turn.locator('strong')).toHaveText('inference cost');
  await expect(turn.locator('code.turn-code-inline')).toHaveText('metric');
  await expect(turn.locator('ul li')).toHaveCount(2);
  await expect(turn.locator('.turn-table table')).toBeVisible();
  await expect(turn.locator('.turn-code__lang')).toHaveText('python');
  /* No raw markup left on screen. */
  await expect(turn).not.toContainText('**inference cost**');
});

test('a heading inside a turn is never an h1', async ({ page }) => {
  await stub(page, BODY);
  await page.goto('/review/thr_md');
  /* The platform's single h1 is the arrival question; a turn must not compete. */
  await expect(page.locator('.turn-markdown h1')).toHaveCount(0);
  await expect(page.locator('.turn-markdown h2')).toHaveCount(0);
});

test('script markup renders as visible characters and executes nothing', async ({ page }) => {
  const errors: string[] = [];
  page.on('dialog', (d) => { errors.push('dialog'); void d.dismiss(); });
  await stub(page, BODY);
  await page.goto('/review/thr_md');

  await expect(page.locator('.turn-markdown')).toContainText('<script>alert(1)</script>');
  /* No script element was created from the turn, and no alert fired. */
  await expect(page.locator('.turn-markdown script')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('a javascript: link is not an anchor, and an image is not an img', async ({ page }) => {
  await stub(page, BODY);
  await page.goto('/review/thr_md');

  const turn = page.locator('.turn-markdown');
  await expect(turn.locator('a[href^="javascript"]')).toHaveCount(0);
  await expect(turn.locator('img')).toHaveCount(0);
});

test('an off-allowlist link renders as text with its URL visible', async ({ page }) => {
  await stub(page, 'See [the paper](https://evil.example/paper) for details.');
  await page.goto('/review/thr_md');

  const turn = page.locator('.turn-markdown');
  await expect(turn.locator('a[href="https://evil.example/paper"]')).toHaveCount(0);
  /* Shown, not removed: the visitor sees what was suggested. */
  await expect(turn.locator('.turn-link--blocked')).toBeVisible();
  await expect(turn).toContainText('https://evil.example/paper');
});

test('a table scrolls inside the turn and never widens the page', async ({ page }) => {
  const wide = ['| ' + Array.from({ length: 14 }, (_, i) => `column ${i}`).join(' | ') + ' |',
    '|' + ' --- |'.repeat(14),
    '| ' + Array.from({ length: 14 }, (_, i) => `value ${i}`).join(' | ') + ' |'].join('\n');
  await stub(page, wide);
  await page.goto('/review/thr_md');

  const overflowX = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflowX).toBeLessThanOrEqual(1);
  const scrolls = await page.locator('.turn-table').evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(scrolls).toBe(true);
});

test('an unterminated fence renders as literal text', async ({ page }) => {
  await stub(page, 'Here is some code:\n\n```python\nprint(1)');
  await page.goto('/review/thr_md');

  /* Rule 6: literal until it closes. No code block is optimistically opened. */
  await expect(page.locator('.turn-markdown .turn-code')).toHaveCount(0);
  await expect(page.locator('.turn-markdown')).toContainText('```python');
});
