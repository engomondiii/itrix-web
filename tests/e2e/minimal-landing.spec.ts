import { expect, test } from '@playwright/test';

/**
 * R29 — NOTHING RENDERS BELOW THE EXAMPLE PROMPTS.
 *
 * The landing renders the seven approved elements and stops. The v4.0
 * below-fold content (#learn-more, the calm narrative, the trust layer, the
 * drawers, the human follow-up offer) is RELOCATED to the sidebar's Explore
 * group — so this test asserts both halves: gone from here, reachable there.
 */
const BREAKPOINTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

test.describe('the landing is minimal', () => {
  for (const bp of BREAKPOINTS) {
    test(`nothing renders below the pathway hint at ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');

      // The seven approved elements are present.
      await expect(page.getByText('You already know computation is holding you back.')).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'What would you like computation to do better?' }),
      ).toBeVisible();
      await expect(page.getByText(/Start with the workload, system constraint/)).toBeVisible();
      await expect(page.getByRole('textbox', { name: /describe your compute challenge/i })).toBeVisible();
      await expect(page.getByText('A non-confidential summary is enough to begin.')).toBeVisible();
      await expect(page.getByText('Examples from the work our visitors bring')).toBeVisible();

      const pathway = page.getByRole('list', { name: 'What happens after you submit' });
      await expect(pathway).toBeVisible();

      // The retired below-fold sections are gone.
      await expect(page.locator('#learn-more')).toHaveCount(0);
      await expect(page.getByRole('contentinfo')).toHaveCount(0);
      await expect(page.getByRole('banner')).toHaveCount(0);

      // Nothing is rendered after the pathway hint inside the arrival section.
      const trailing = await pathway.evaluate((el) => {
        const inner = el.closest('.arrival__inner');
        if (!inner) return -1;
        const kids = Array.from(inner.children);
        return kids.length - 1 - kids.indexOf(el);
      });
      expect(trailing).toBe(0);
    });
  }

  test('the relocated content is reachable from the sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.getByRole('button', { name: /explore itriX/i }).click();
    await expect(page.getByRole('link', { name: 'ALPHA Compute' })).toBeVisible();
    await expect(page.getByRole('button', { name: /what can be discussed before an NDA/i })).toBeVisible();
  });
});
