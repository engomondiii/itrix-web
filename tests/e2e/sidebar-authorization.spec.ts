import { expect, test } from '@playwright/test';

/**
 * THE SIDEBAR IS RENDERED, NOT DECIDED (Surface 1 v5.0 §3.2).
 *
 * Removing a section from the backend payload must remove it from the UI,
 * because nothing in the frontend holds a list. This replaces the retired
 * rails-authorization spec.
 */
test.describe('the sidebar reflects the backend contract', () => {
  test('a section the backend does not authorize does not render', async ({ page }) => {
    await page.route('**/api/shell*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          journeyState: 10,
          sidebarSections: ['brand_nav', 'new_review', 'conversations', 'explore', 'legal'],
        }),
      });
    });

    await page.goto('/');

    // Base sections render.
    await expect(page.getByRole('button', { name: /New review/i })).toBeVisible();
    await expect(page.getByText('Your reviews')).toBeVisible();

    // State 10 sections were NOT authorized, so they are absent despite the state.
    await expect(page.getByText('Outcomes', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Deployments', { exact: true })).toHaveCount(0);
  });

  test('an unknown section key renders nothing and does not crash', async ({ page }) => {
    await page.route('**/api/shell*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          journeyState: 2,
          sidebarSections: ['brand_nav', 'totally_made_up', 'legal'],
        }),
      });
    });

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('totally_made_up')).toHaveCount(0);
  });
});
