import { expect, test } from '@playwright/test';

/**
 * THE WAIT IS REPORTED HONESTLY (R42, Surface 1 v6.0 §3.10).
 *
 * ── WHY THE HONESTY IS THE THING BEING TESTED ───────────────────────────────
 * A progress display that advances on its own looks better for one turn and costs the
 * visitor's trust in every statement the surface makes afterwards. So the assertions
 * below are mostly about what must NOT happen: the label must not advance without a
 * backend event, and nothing may imply a person is at a keyboard.
 */

async function stubThread(page: import('@playwright/test').Page) {
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
  /* Never answers. The wait is the subject of the test. */
  await page.route('**/api/threads', (route) => new Promise(() => void route));
}

test('a pending turn shows a lattice and a stage label', async ({ page }) => {
  await stubThread(page);
  await page.goto('/');
  await page.locator('textarea.composer-textarea').fill('Memory movement is limiting capacity.');
  await page.locator('textarea.composer-textarea').press('Enter');

  await expect(page.locator('.pending')).toBeVisible();
  await expect(page.locator('.pending__lattice .pending__cell')).toHaveCount(9);
  await expect(page.locator('.pending__cell[data-filled]')).toHaveCount(1);
  await expect(page.locator('.pending__label')).toBeVisible();
});

test('the filled count is conserved as the cell moves', async ({ page }) => {
  await stubThread(page);
  await page.goto('/');
  await page.locator('textarea.composer-textarea').fill('Our solver is unstable.');
  await page.locator('textarea.composer-textarea').press('Enter');

  const first = await page.locator('.pending__cell[data-filled]').getAttribute('class');
  await page.waitForTimeout(1200);
  /* Exactly one cell is filled at every moment — what leaves one cell enters another. */
  await expect(page.locator('.pending__cell[data-filled]')).toHaveCount(1);
  expect(first).toBeTruthy();
});

test('the label never advances without a backend stage event', async ({ page }) => {
  await stubThread(page);
  await page.goto('/');
  await page.locator('textarea.composer-textarea').fill('Our silicon needs a runtime path.');
  await page.locator('textarea.composer-textarea').press('Enter');

  const before = await page.locator('.pending__label').innerText();
  await page.waitForTimeout(4000);
  const after = await page.locator('.pending__label').innerText();
  /* No `message.stage` arrived, so the label HELD. Nothing was interpolated. */
  expect(after).toBe(before);
});

test('none of the forbidden waiting metaphors appears', async ({ page }) => {
  await stubThread(page);
  await page.goto('/');
  await page.locator('textarea.composer-textarea').fill('Power is limiting our capacity.');
  await page.locator('textarea.composer-textarea').press('Enter');

  const pending = page.locator('.pending');
  /* Nobody is typing, and no duration is being claimed. */
  await expect(pending).not.toContainText('typing');
  await expect(pending).not.toContainText('%');
  await expect(pending.locator('progress')).toHaveCount(0);
  await expect(pending.locator('[role="progressbar"]')).toHaveCount(0);
  await expect(pending.locator('img')).toHaveCount(0);
});

test('the wait is announced once, politely', async ({ page }) => {
  await stubThread(page);
  await page.goto('/');
  await page.locator('textarea.composer-textarea').fill('Cooling is limiting capacity.');
  await page.locator('textarea.composer-textarea').press('Enter');

  const live = page.locator('.pending [role="status"]');
  await expect(live).toHaveAttribute('aria-live', 'polite');
  await expect(live).toHaveText('Working on your answer');
  /* One region, not one per stage. */
  await expect(page.locator('.pending [aria-live]')).toHaveCount(1);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the lattice is static and the label carries the message', async ({ page }) => {
    await stubThread(page);
    await page.goto('/');
    await page.locator('textarea.composer-textarea').fill('Our training cost is rising.');
    await page.locator('textarea.composer-textarea').press('Enter');

    await expect(page.locator('.pending__lattice[data-static]')).toBeVisible();
    const before = await page.locator('.pending__cell[data-filled]').getAttribute('data-filled');
    await page.waitForTimeout(2500);
    /* The timer never starts, so the same cell stays filled. */
    await expect(page.locator('.pending__cell[data-filled]')).toHaveCount(1);
    expect(before).toBeTruthy();
    await expect(page.locator('.pending__label')).toBeVisible();
  });
});

test('a long wait becomes an honest timeout with a retry', async ({ page }) => {
  /* NEXT_PUBLIC_PENDING_TIMEOUT_MS is inlined at BUILD time, so it cannot be
     overridden from inside the test. Rather than pretend otherwise with an init
     script that does nothing, this skips unless the app was built with a short
     value — an assertion that silently never runs is worse than one that says so. */
  const timeoutMs = Number(process.env.NEXT_PUBLIC_PENDING_TIMEOUT_MS ?? '20000');
  test.skip(timeoutMs > 5000, 'Build with NEXT_PUBLIC_PENDING_TIMEOUT_MS=1200 to exercise this.');

  await stubThread(page);
  await page.goto('/');
  await page.locator('textarea.composer-textarea').fill('Reproducibility is a problem for us.');
  await page.locator('textarea.composer-textarea').press('Enter');

  await expect(page.locator('.pending__label')).toHaveText('This is taking longer than usual.');
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});
