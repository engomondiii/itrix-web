import { expect, test } from '@playwright/test';

const protectedInternalTerms = [
  'trustScore',
  'trust score',
  'iwlReasoning',
  'IWL reasoning',
  'waiverPolicyCriteria',
  'waiver policy criteria',
  'alphaCoreReady',
  'alphaComputeReady',
];

test('public ASTOP presents controlled progression without obsolete fixed-price purchase UI', async ({ page }) => {
  await page.goto('/astop');
  await expect(page.getByRole('heading', { level: 1, name: 'A System Trans-Observation Projector' })).toBeVisible();
  await expect(page.getByText('License-Out & Deployment', { exact: true })).toBeVisible();
  await expect(page.getByText(/not offered as an anonymous executable, public checkout or self-service subscription/i)).toBeVisible();

  const main = page.locator('main');
  await expect(main).not.toContainText(/\$\s?\d/);
  await expect(page.getByRole('button', { name: /buy|checkout|subscribe/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /buy|checkout|subscribe/i })).toHaveCount(0);
});

test('public PRISM remains available as supporting technology without protected ASTOP/ALPHA internals', async ({ page }) => {
  await page.goto('/technology/prism');
  await expect(page.getByRole('heading', { level: 1, name: 'PRISM' })).toBeVisible();
  await expect(page.getByText('Projection and Representation for Intelligent Semantic Monitoring', { exact: true })).toBeVisible();
  await expect(page.getByText(/supporting technology, not a separately purchasable product/i)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore ASTOP' })).toBeVisible();

  const main = page.locator('main');
  for (const protectedTerm of protectedInternalTerms) await expect(main).not.toContainText(protectedTerm);
  await expect(main).not.toContainText(/\$\s?\d/);
});
