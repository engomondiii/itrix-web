import { expect, test } from '@playwright/test';

const now = () => new Date().toISOString();

function thread(id: string, title: string, body: string) {
  return {
    id, title, createdAt: now(), lastActivityAt: now(),
    turns: [{ id: `${id}-t1`, senderKind: 'visitor', body, seq: 1, status: 'settled' }],
    artifacts: [], cards: [],
  };
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/shell*', (route) => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({
      shellMode: 'working', journeyState: 2,
      conversationRailSections: ['new_chat', 'conversations', 'account'],
      contentPaneSections: [],
      conversationHeader: { title: 'Review', stateLabel: 'Review', quickHelp: false },
    }),
  }));
  await page.route('**/api/threads', (route) => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ threads: [{ threadId: 'thr_one', title: 'Inference cost', lastActivityAt: now() }] }),
  }));
  await page.route('**/api/threads/thr_one', (route) => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify(thread('thr_one', 'Inference cost', 'FIRST THREAD SENTENCE')),
  }));
});

test('manual rename has a labelled focus-trapped dialog and remains authoritative after refresh', async ({ page }) => {
  await page.goto('/review/thr_one');
  const opener = page.getByRole('button', { name: /Rename.*Inference cost/i });
  await opener.focus();
  await opener.click();

  const dialog = page.getByRole('dialog', { name: 'Rename conversation' });
  await expect(dialog).toBeVisible();
  const field = page.getByLabel('Conversation name');
  await expect(field).toBeFocused();

  const close = dialog.getByRole('button', { name: 'Close' });
  const save = dialog.getByRole('button', { name: 'Save' });
  await close.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(save).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();

  await opener.click();
  await field.fill('My inference workload');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('.rail-thread__title')).toHaveText('My inference workload');

  // The server still returns its generated title on refresh; a manual title must win.
  await page.reload();
  await expect(page.locator('.rail-thread__title')).toHaveText('My inference workload');
  await expect(page.locator('.rail-thread__title')).not.toContainText('FIRST THREAD SENTENCE');
});
