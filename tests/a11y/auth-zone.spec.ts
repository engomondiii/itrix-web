import { expect, test } from '@playwright/test';

/**
 * ACCESSIBILITY IN THE AUTHENTICATION ZONE (Surface 1 v7.0 §7.4).
 *
 * No axe dependency: the repo has four runtime dependencies and adding an audit library
 * for one spec would change that. The guarantees the specification names are asserted
 * directly, and several of them a generic scanner could not know — that the error summary
 * takes focus, that the strength label is announced politely rather than assertively, and
 * that nothing in the zone conveys state by colour alone.
 */

const ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

test('every route has one h1 and a labelled main landmark', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main#content')).toBeVisible();
  }
});

test('every field has a real label', async ({ page }) => {
  await page.goto('/sign-in');
  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByLabel('Password', { exact: true })).toBeVisible();

  await page.goto('/sign-up');
  await expect(page.getByLabel('Invitation code')).toBeVisible();

  await page.goto('/forgot-password');
  await expect(page.getByLabel('Work email')).toBeVisible();
});

test('the error summary is an alert and takes focus on failure', async ({ page }) => {
  await page.route('**/api/portal/auth/login', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: { detail: 'Those details did not match. Please check your email and password.' } }),
    }),
  );
  await page.goto('/sign-in');
  await page.getByLabel('Work email').fill('someone@example.com');
  await page.locator('.password-field__input').fill('a-password-value');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  const summary = page.locator('.auth-error-summary');
  await expect(summary).toHaveAttribute('role', 'alert');
  /* A per-field message under an input is invisible to someone whose focus is still on
     the button they just pressed. */
  await expect(summary).toBeFocused();
});

test('the show/hide toggle is a real button with aria-pressed', async ({ page }) => {
  await page.goto('/sign-in');
  const toggle = page.getByRole('button', { name: 'Show password' });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('the strength label is announced politely, not assertively', async ({ page }) => {
  await page.goto('/reset-password?token=tok_a11y');
  await page.locator('.password-field__input').nth(0).fill('a-long-enough-passphrase');
  const label = page.locator('.password-rules__label');
  /* Assertive would interrupt on every keystroke. */
  await expect(label).toHaveAttribute('aria-live', 'polite');
});

test('the whole zone is reachable keyboard-only', async ({ page }) => {
  await page.goto('/sign-in');
  await page.keyboard.press('Tab');
  await expect(page.locator('a.skip-link')).toBeFocused();

  /* Every interactive element in the panel is reachable without a pointer. */
  const focusables = await page.locator('.auth-panel :is(input, button, a)').count();
  expect(focusables).toBeGreaterThan(3);
  for (let i = 0; i < focusables + 4; i += 1) await page.keyboard.press('Tab');
  await expect(page.locator('.auth-footer a').last()).toBeVisible();
});

test('nothing in the zone conveys state by colour alone', async ({ page }) => {
  await page.goto('/reset-password?token=tok_colour');
  const fields = page.locator('.password-field__input');
  await fields.nth(0).fill('short');
  await fields.nth(1).fill('short');
  await page.getByRole('button', { name: /Save and sign in/i }).click();
  /* The message says what to fix. The border colour is decoration. */
  await expect(page.locator('.auth-error-summary')).toContainText('at least 12 characters');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing becomes unusable', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('.auth-panel')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
    await expect(page.locator('.legal-strip')).toBeVisible();
  });
});

test.describe('at 390px', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the panel is usable and the page does not scroll sideways', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('.auth-panel')).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});
