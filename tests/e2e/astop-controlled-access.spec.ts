import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/website/config', route => route.fulfill({ json: { notice: null, store: { state: 'pre_launch', stores: [] } } }));
});

test('ASTOP pre-launch access offers interest registration without checkout or downloads', async ({ page }) => {
  await page.goto('/en/astop');
  await expect(page.getByText(/being prepared for Apple App Store/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register interest', exact: true })).toBeVisible();
  await expect(page.locator('a[href*="apps.apple.com"],a[href*="apps.microsoft.com"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /buy astop|checkout|download astop/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /buy astop|checkout|download astop/i })).toHaveCount(0);
});

test('public language links preserve the current ASTOP page', async ({ page }) => {
  await page.goto('/en/astop');
  await page.getByRole('link', { name: 'KO', exact: true }).first().click();
  await expect(page).toHaveURL(/\/astop$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await page.getByRole('link', { name: 'EN', exact: true }).first().click();
  await expect(page).toHaveURL(/\/en\/astop$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
