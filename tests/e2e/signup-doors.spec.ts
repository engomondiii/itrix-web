import { expect, test } from '@playwright/test';

/**
 * SIGN UP — open registration is the current default (Architecture v2.9 §27).
 *
 * `NEXT_PUBLIC_ENABLE_OPEN_SIGNUP=false` remains an operational kill switch. These tests
 * deliberately cover both semantics without forcing the application back to the superseded
 * v2.8 "earned accounts only" model.
 */
const OPEN_SIGNUP = (process.env.NEXT_PUBLIC_ENABLE_OPEN_SIGNUP ?? '').toLowerCase() !== 'false';

test('open registration is available in the default current configuration', async ({ page }) => {
  test.skip(!OPEN_SIGNUP, 'This assertion is for the default/open-signup configuration.');

  await page.goto('/sign-up');

  await expect(page.getByRole('button', { name: /Create workspace/i })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toHaveCount(1);
  await expect(page.locator('.password-field__input')).toHaveCount(2);
  await expect(page.getByRole('button', { name: /invitation code/i })).toBeVisible();

  /* The BFF route is present when registration is enabled. A deliberately malformed request
     is rejected locally with 400 before any backend/account lookup, which proves the route is
     reachable without depending on Django or leaking account existence. */
  const status = await page.evaluate(async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'a@b.com',
        password: 'a-long-enough-pass',
        fullName: 'A',
        organization: 'B',
      }),
    });
    return res.status;
  });
  expect(status).toBe(400);
});

test('explicitly disabled registration uses the closed kill-switch surface', async ({ page }) => {
  test.skip(OPEN_SIGNUP, 'Run this assertion with NEXT_PUBLIC_ENABLE_OPEN_SIGNUP=false.');

  await page.goto('/sign-up');

  await expect(page.getByRole('button', { name: /Create workspace/i })).toHaveCount(0);
  await expect(page.locator('input[type="email"]')).toHaveCount(0);
  await expect(page.locator('.password-field__input')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Start the conversation/i })).toBeVisible();

  /* A disabled capability does not advertise itself with a 403. */
  const status = await page.evaluate(async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'a@b.com',
        password: 'a-long-enough-pass',
        fullName: 'A',
        organization: 'B',
        assent: ['terms:test'],
      }),
    });
    return res.status;
  });
  expect(status).toBe(404);
});

test('invitation-code option hands off to the existing assent-gated flow', async ({ page }) => {
  await page.route('**/api/auth/invite/lookup**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ usable: true, redeemUrl: '/c/tok_handoff/create-account' }),
    }),
  );

  await page.goto('/sign-up');
  await page.getByRole('button', { name: /invitation code/i }).click();
  await page.getByLabel('Invitation code').fill('tok_handoff');
  await page.getByRole('button', { name: 'Continue' }).click();

  /* Rebuilding account creation here would create a second assent path. */
  await expect(page).toHaveURL(/\/invite\/tok_handoff\/create-account/);
});

test('the invitation-code field does not fight a phone keyboard', async ({ page }) => {
  await page.goto('/sign-up');
  await page.getByRole('button', { name: /invitation code/i }).click();

  const field = page.getByLabel('Invitation code');
  await expect(field).toHaveAttribute('autocapitalize', 'off');
  await expect(field).toHaveAttribute('spellcheck', 'false');
  await expect(field).toHaveAttribute('autocomplete', 'off');
});
