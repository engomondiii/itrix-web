import { expect, test } from '@playwright/test';

/**
 * NEW CHAT, PREVIOUS CHAT, AND WHERE YOU LEFT OFF (R36, R37, §3.12).
 *
 * Three properties, each of which a naive implementation gets wrong:
 *
 *   1. THE SHELL IS NEVER UNMOUNTED by a switch. A route transition would throw away
 *      focus, in-flight uploads and the whole point of the two-mode shell.
 *   2. BACK RETURNS TO THE PREVIOUS THREAD. A switch uses pushState; a submit uses
 *      replaceState. Collapsing those into one would either give every turn a history
 *      entry or make Back skip the conversation the visitor was reading.
 *   3. A NEW CHAT INHERITS THE SUBJECT'S STATE. It never re-qualifies a customer.
 */

const now = () => new Date().toISOString();

function thread(id: string, title: string, body: string) {
  return {
    id, title, createdAt: now(), lastActivityAt: now(),
    turns: [{ id: `${id}-t1`, senderKind: 'visitor', body, seq: 1, status: 'settled' }],
    artifacts: [], cards: [],
  };
}

test.beforeEach(async ({ page }) => {
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
  await page.route('**/api/threads', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        threads: [
          { threadId: 'thr_one', title: 'Inference cost', lastActivityAt: now() },
          { threadId: 'thr_two', title: 'Memory movement', lastActivityAt: now() },
        ],
      }),
    }),
  );
  await page.route('**/api/threads/thr_one', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify(thread('thr_one', 'Inference cost', 'FIRST THREAD SENTENCE')) }),
  );
  await page.route('**/api/threads/thr_two', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify(thread('thr_two', 'Memory movement', 'SECOND THREAD SENTENCE')) }),
  );
});

test('selecting a previous conversation swaps the transcript without unmounting the shell', async ({ page }) => {
  await page.goto('/review/thr_one');
  await expect(page.locator('.transcript__log')).toContainText('FIRST THREAD SENTENCE');

  /* Tag the live shell. If a switch unmounts it, the marker is gone. */
  await page.evaluate(() => {
    const el = document.querySelector('.working-shell');
    if (el) (el as HTMLElement).dataset.probe = 'kept';
  });

  let navigated = false;
  page.on('framenavigated', () => { navigated = true; });

  await page.locator('.rail-thread__open', { hasText: 'Memory movement' }).click();

  await expect(page.locator('.transcript__log')).toContainText('SECOND THREAD SENTENCE');
  await expect(page.locator('.working-shell[data-probe="kept"]')).toHaveCount(1);
  expect(navigated).toBe(false);
});

test('Back returns to the previous thread', async ({ page }) => {
  await page.goto('/review/thr_one');
  await page.locator('.rail-thread__open', { hasText: 'Memory movement' }).click();
  expect(page.url()).toContain('/review/thr_two');

  await page.goBack();
  /* pushState on a switch is what makes this work (§2.8). */
  expect(page.url()).toContain('/review/thr_one');
});

test('a submit does NOT add a history entry', async ({ page }) => {
  await page.route('**/api/threads/thr_one/turns', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ threadId: 'thr_one', turn: { id: 'x', senderKind: 'visitor', body: 'another', seq: 2 } }) }),
  );
  await page.goto('/review/thr_one');
  const before = await page.evaluate(() => window.history.length);

  await page.locator('textarea.composer-textarea').fill('One more thing.');
  await page.locator('textarea.composer-textarea').press('Enter');
  await expect(page.locator('.transcript__log')).toContainText('One more thing.');

  const after = await page.evaluate(() => window.history.length);
  /* replaceState, so Back never means "undo one message". */
  expect(after).toBe(before);
});

test('a half-typed message does not follow the visitor into another thread', async ({ page }) => {
  await page.goto('/review/thr_one');
  await page.locator('textarea.composer-textarea').fill('draft for the FIRST conversation');

  await page.locator('.rail-thread__open', { hasText: 'Memory movement' }).click();
  /* Carrying it across would be worse than losing it — it would be sent to the wrong
     conversation. */
  await expect(page.locator('textarea.composer-textarea')).toHaveValue('');
});

test('scroll position is restored on return', async ({ page }) => {
  /* A long thread, so there is something to scroll. */
  await page.route('**/api/threads/thr_long', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'thr_long', title: 'Long', createdAt: now(), lastActivityAt: now(),
        turns: Array.from({ length: 40 }, (_, i) => ({
          id: `l${i}`, senderKind: i % 2 ? 'agent' : 'visitor',
          body: `Turn number ${i} with enough text to occupy a line or two of the transcript.`,
          seq: i + 1, status: 'settled',
        })),
        artifacts: [], cards: [],
      }),
    }),
  );
  await page.goto('/review/thr_long');

  await page.locator('.transcript').evaluate((el) => { el.scrollTop = 420; });
  await page.waitForTimeout(400); // the save is throttled
  const saved = await page.locator('.transcript').evaluate((el) => el.scrollTop);

  await page.locator('.rail-thread__open', { hasText: 'Memory movement' }).click();
  await expect(page.locator('.transcript__log')).toContainText('SECOND THREAD SENTENCE');

  await page.goBack();
  await expect(page.locator('.transcript__log')).toContainText('Turn number 0');
  const restored = await page.locator('.transcript').evaluate((el) => el.scrollTop);
  /* Within a few pixels — the container's height can differ by a hair after relayout. */
  expect(Math.abs(restored - saved)).toBeLessThan(24);
});

test('New chat returns to the front door and clears the active thread', async ({ page }) => {
  await page.goto('/review/thr_one');
  await page.getByRole('button', { name: /New chat/i }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('h1')).toHaveText('What would you like computation to do better?');
});


test('conversation history uses topic labels and omits relative-time captions', async ({ page }) => {
  await page.route('**/api/threads', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        threads: [
          {
            threadId: 'thr_topic',
            title: 'How can we reduce HBM traffic on our inference fleet?',
            lastActivityAt: now(),
          },
        ],
      }),
    }),
  );

  await page.goto('/review/thr_one');
  const row = page.locator('.rail-thread__open').filter({ hasText: 'Reduce HBM traffic on our inference fleet' });
  await expect(row).toBeVisible();
  await expect(row).not.toContainText('ago');
  await expect(row).not.toContainText('How can we');
  await expect(page.locator('.rail-thread__time')).toHaveCount(0);
});
