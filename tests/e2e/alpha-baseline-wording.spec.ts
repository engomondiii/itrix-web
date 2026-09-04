import { expect, test } from '@playwright/test';

test('ALPHA Compute explains a versioned, correctable evaluation baseline', async ({ page }) => {
  await page.goto('/alpha-compute');
  const body = page.locator('body');
  await expect(body).toContainText('baseline is defined and versioned before testing');
  await expect(body).toContainText('Material baseline errors may be corrected');
  await expect(body).toContainText('reason documented');
  await expect(body).toContainText('affected comparisons rerun');
  await expect(body).not.toContainText('frozen baseline');
});
