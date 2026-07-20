import { expect, test } from '@playwright/test';

/**
 * A suggested question POPULATES the composer. It never submits.
 *
 * The same contract as the example chips on the landing, deliberately — the
 * interaction is learned once (Surface 1 v5.0 §3.8).
 */
test('choosing a suggested question fills the composer without sending', async ({ page }) => {
  await page.goto('/');
  const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
  await composer.fill('Our inference cost is climbing faster than usage.');
  await composer.press('Enter');

  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent('itrix:test-socket', {
        detail: {
          type: 'question.suggested',
          payload: { threadId: 't', chips: ['What does the workload run on today?'] },
        },
      }),
    );
  });

  const chip = page.getByRole('button', { name: /What does the workload run on today\?/i });
  await expect(chip).toBeVisible();

  const before = await page.getByRole('log').locator('article').count();
  await chip.click();

  // The composer is filled and focused; nothing was sent.
  await expect(page.getByRole('textbox', { name: /reply to itriX/i })).toHaveValue(
    /What does the workload run on today\?/,
  );
  const after = await page.getByRole('log').locator('article').count();
  expect(after).toBe(before);
});
