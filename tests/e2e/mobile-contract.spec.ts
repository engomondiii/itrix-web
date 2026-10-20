import { expect, test } from '@playwright/test';

/**
 * THE MOBILE CONTRACT (R45, Architecture v2.7 §25).
 *
 * Organised by the FIVE GUARANTEES rather than by breakpoint, because the breakpoints
 * exist to serve the guarantees — and a test filed under "390px" is a test nobody can
 * check against the specification.
 *
 *   1. the composer is reachable and usable, above the keyboard;
 *   2. the current task is never lost to a layout change;
 *   3. quick help stays one action from a named human (R30);
 *   4. the confidentiality notice stays visible wherever a problem can be described;
 *   5. the legal instruments stay reachable.
 */

const PHONE = { width: 390, height: 844 };

const CUSTOMER_SHELL = {
  shellMode: 'working',
  journeyState: 10,
  conversationRailSections: ['new_chat', 'conversations', 'account'],
  contentPaneSections: ['artifacts', 'outcomes', 'support', 'explore', 'legal'],
  conversationHeader: {
    title: 'HBM traffic on the inference fleet',
    stateLabel: 'Customer success',
    humanOwner: 'Sora Kim',
    supportSla: '2h',
    quickHelp: true,
  },
};

async function stub(page: import('@playwright/test').Page) {
  await page.route('**/api/shell*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CUSTOMER_SHELL) }),
  );
  await page.route('**/api/threads/thr_m', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'thr_m', title: 'HBM traffic',
        createdAt: new Date().toISOString(), lastActivityAt: new Date().toISOString(),
        turns: Array.from({ length: 12 }, (_, i) => ({
          id: `t${i}`, role: i % 2 ? 'itrix' : 'visitor',
          body: `Turn ${i} with enough text to occupy a line or two of the transcript.`,
          seq: i + 1, status: 'settled',
        })),
        artifacts: [], cards: [],
      }),
    }),
  );
}

test.use({ viewport: PHONE });

test('guarantee 1 — the composer is on screen and usable at 390px', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');

  const composer = page.locator('textarea.composer-textarea');
  await expect(composer).toBeVisible();
  await composer.fill('A question from a phone.');
  await expect(composer).toHaveValue('A question from a phone.');

  /* Inside the viewport, not below it. */
  const box = await composer.boundingBox();
  expect(box).not.toBeNull();
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(PHONE.height + 1);
});

test('guarantee 2 — navigation opens without exposing the disabled reading pane', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');
  await page.getByRole('button', { name: /Open navigation/i }).first().click();
  await expect(page.locator('.rail-sheet__panel')).toBeVisible();
  await expect(page.locator('.pane-sheet__panel')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Open content|Hide content/i })).toHaveCount(0);
});

test('guarantee 2 — Escape closes navigation and focus returns to the opener', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');
  const opener = page.getByRole('button', { name: /Open navigation/i }).first();
  await opener.click();
  await expect(page.locator('.rail-sheet__panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.rail-sheet__panel')).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('guarantee 3 — quick help is one action from a named human', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');

  const help = page.getByRole('button', { name: 'Get help' });
  await expect(help).toBeVisible();
  /* ONE action, not one action after opening a menu (R30). */
  await help.click();
  await expect(page.locator('#quick-help')).toContainText('Message your specialist');
});

test('guarantee 4 — the confidentiality notice stays visible and legible', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');

  const note = page.locator('.composer-footer__note');
  await expect(note).toBeVisible();
  await expect(note).toContainText('Please do not submit confidential technical information');
  /* Never below the 13px floor for informational text (§21.12). */
  const size = await note.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(13);
});

test('guarantee 5 — the legal instruments stay reachable', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');

  await page.getByRole('button', { name: /Open navigation/i }).first().click();
  for (const label of ['Terms', 'Privacy', 'Security', 'Disclosure policy']) {
    await expect(page.locator('.legal-strip').getByRole('link', { name: label }).first()).toBeVisible();
  }
});

test('the page never scrolls sideways', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('the disabled reading pane never occupies a mobile column', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');
  /* Rendering both would put two copies of the same panel in the tree. */
  await expect(page.locator('aside.content-pane')).toHaveCount(0);
});

test('visible navigation and quick-help targets are at least 44px', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_m');
  const targets = [
    page.getByRole('button', { name: /Open navigation/i }).first(),
    page.getByRole('button', { name: 'Get help' }),
  ];
  for (const target of targets) {
    await expect(target).toBeVisible();
    const box = await target.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  }
});
