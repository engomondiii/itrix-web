import { test, expect } from '@playwright/test';

/**
 * THE REGISTRATION ZONE, WITHOUT A MOUSE (Surface 1 v8.0 §07.4).
 *
 * No axe dependency, deliberately — the repo keeps four runtime dependencies and a generic
 * scanner cannot check the guarantees that actually matter here. These are asserted
 * directly instead.
 */

test('every field has a real label and the summary takes focus on failure', async ({ page }) => {
  await page.goto('/sign-up');
  for (const label of ['Full name', 'Company or organization', 'Role (optional)', 'Work email', 'Password', 'Confirm password']) {
    await expect(page.getByLabel(label, { exact: true })).toHaveCount(1);
  }
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await expect(page.locator('.auth-error-summary')).toBeFocused();
});

test('the show/hide toggle is a real button with aria-pressed', async ({ page }) => {
  await page.goto('/sign-up');
  const toggle = page.locator('.password-field__toggle').first();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
});

test('the invitation disclosure is reachable by keyboard alone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/sign-up');
  const trigger = page.getByRole('button', { name: /invitation code/i });
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByLabel('Invitation code')).toBeVisible();
});

test('under reduced motion nothing is lost', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/sign-up');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Create workspace' })).toBeVisible();
  await expect(page.locator('.legal-strip a')).toHaveCount(4);
  await context.close();
});
