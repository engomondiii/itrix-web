import { test, expect } from '@playwright/test';

/**
 * ACCEPTANCE — the no-repeat-intake contract (Surface 1 v4.0 §2.3).
 *
 *   The sentence typed on the approved center IS the first review turn. The
 *   review surface continues from it. A second "describe your bottleneck" input
 *   anywhere in the flow is a defect.
 *
 * This is the test that keeps it true, because the regression is invisible in
 * review: both screens look reasonable on their own.
 */

const SENTENCE = 'Our nightly CFD run is dominated by dense linear solves and the cluster bill keeps climbing.';

test('the center sentence carries into the review and is not re-asked', async ({ page }) => {
  await page.goto('/');

  const composer = page.getByLabel(/describe your compute challenge/i);
  await expect(composer).toBeVisible();
  await composer.fill(SENTENCE);
  await page.getByRole('button', { name: /begin review/i }).click();

  await page.waitForURL('**/review');

  // The captured sentence is present and editable.
  await expect(page.getByText('What we heard')).toBeVisible();
  await expect(page.locator('textarea')).toHaveValue(SENTENCE);

  // And nothing on this page asks for it again.
  await expect(page.getByText(/describe the workload that/i)).toHaveCount(0);
  await expect(page.getByText(/what would you like computation to do better/i)).toHaveCount(0);
});

test('selecting an example populates the composer but does not submit', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /training and inference cost/i }).click();

  await expect(page).toHaveURL(/\/$/);           // still on the center
  await expect(page.getByLabel(/describe your compute challenge/i)).toHaveValue(
    /training and inference cost/i,
  );
});

test('a visitor who lands on /review directly still gets one input', async ({ page }) => {
  await page.goto('/review');

  // Cold start: the question appears here because it appeared nowhere else.
  await expect(page.getByText(/what would you like computation to do better/i)).toBeVisible();
  await expect(page.locator('textarea')).toHaveCount(1);
});
