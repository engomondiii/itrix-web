import { test, expect } from '@playwright/test';

/**
 * Arrival switches to the established conversation layout without a document reload.
 * Verify the observable contract: the first message survives, the URL addresses its
 * thread, and the visitor can immediately draft a follow-up. React may replace the
 * textarea when moving between the existing arrival and docked layouts; attachment
 * lifecycle has its own regression suite.
 */

test('both zones are absent at State 1 and present at State 2', async ({ page }) => {
  await page.goto('/ask-x');
  await expect(page.locator('.conversation-rail')).toHaveCount(0);

  await page.locator('textarea.composer-textarea').fill(
    'Our inference cost is rising faster than the value it creates.',
  );
  await page.getByRole('button', { name: 'Ask itriX' }).click();

  await expect(page.locator('.working-shell')).toBeVisible();
  await expect(page.locator('.conversation-rail')).toBeVisible();
});

test('submitting keeps the document, submitted message and usable composer', async ({ page }) => {
  await page.goto('/ask-x');

  const navigationCount = await page.evaluate(() => performance.getEntriesByType('navigation').length);

  await page.locator('textarea.composer-textarea').fill('Memory movement is limiting our capacity.');
  await page.locator('textarea.composer-textarea').press('Enter');

  await expect(page.locator('.working-shell')).toBeVisible();
  expect(await page.evaluate(() => performance.getEntriesByType('navigation').length)).toBe(navigationCount);
  await expect(page.locator('.transcript__log')).toContainText('Memory movement is limiting our capacity.');
  await page.locator('textarea.composer-textarea').fill('A follow-up draft');
  await expect(page.locator('textarea.composer-textarea')).toHaveValue('A follow-up draft');
  /* The URL follows via replaceState, which is a rewrite rather than a navigation. */
  expect(page.url()).toContain('/review/');
});

test('the visitor turn is still on screen after the zones mount', async ({ page }) => {
  await page.goto('/ask-x');
  const sentence = 'Our solver is slow and difficult to reproduce.';
  await page.locator('textarea.composer-textarea').fill(sentence);
  await page.locator('textarea.composer-textarea').press('Enter');
  await expect(page.locator('.transcript__log')).toContainText(sentence);
});
