import { expect, test } from '@playwright/test';

/**
 * THE RESET FLOW (R50, R51).
 *
 * ── THE PROPERTY THIS FILE EXISTS FOR ───────────────────────────────────────
 * A reset token must work ONCE. The invite path got the equivalent wrong — its recovery
 * branch ran before the nonce was consumed, so a single-use invite token could be reused
 * and `test_single_use_enforced` failed. The reset flow is the same shape with the same
 * temptation, and the enforcement is on the backend
 * (Backend v7.1 §15.3: burn precedes write, in one transaction).
 *
 * What the SURFACE can be tested for is that it never contradicts that: a rejected token
 * produces one message, offers a new link, and never suggests trying again.
 */

test('a missing token is treated exactly like a bad one', async ({ page }) => {
  await page.goto('/reset-password');
  await expect(page.locator('.auth-confirmation')).toContainText('no longer usable');
  await expect(page.getByRole('link', { name: /Send me a new link/i })).toBeVisible();
});

test('a rejected token gives one message and offers a new link', async ({ page }) => {
  await page.route('**/api/auth/password-reset/confirm', (route) =>
    route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ detail: 'That link is no longer usable.' }) }),
  );
  await page.goto('/reset-password?token=tok_used');
  const fields = page.locator('.password-field__input');
  await fields.nth(0).fill('a-long-enough-passphrase');
  await fields.nth(1).fill('a-long-enough-passphrase');
  await page.getByRole('button', { name: /Save and sign in/i }).click();

  await expect(page.locator('.auth-confirmation')).toContainText('no longer usable');
  await expect(page.getByRole('link', { name: /Send me a new link/i })).toBeVisible();
  /* It never names WHICH cause: expired, consumed and unknown are one message, because
     telling an attacker holding a guessed token that it "expired" confirms they guessed a
     real one. */
  const body = await page.locator('body').innerText();
  expect(body.toLowerCase()).not.toContain('already been used');
  expect(body.toLowerCase()).not.toContain('token not found');
});

test('success names the session invalidation (R51)', async ({ page }) => {
  await page.route('**/api/auth/password-reset/confirm', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ changed: true }) }),
  );
  await page.goto('/reset-password?token=tok_good');
  const fields = page.locator('.password-field__input');
  await fields.nth(0).fill('a-long-enough-passphrase');
  await fields.nth(1).fill('a-long-enough-passphrase');
  await page.getByRole('button', { name: /Save and sign in/i }).click();

  /* Being silently signed out of another device looks like a fault; being told reads as
     the product working. */
  await expect(page.locator('.auth-confirmation')).toContainText('signed out everywhere else');
});

test('a rate limit is a stated wait, not a silent failure (R55)', async ({ page }) => {
  await page.route('**/api/auth/password-reset/request', (route) =>
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      headers: { 'Retry-After': '120' },
      body: JSON.stringify({ accepted: false, retryAfter: 120 }),
    }),
  );
  await page.goto('/forgot-password');
  await page.getByLabel('Work email').fill('someone@example.com');
  await page.getByRole('button', { name: /Send the reset link/i }).click();

  await expect(page.locator('.auth-rate-limit')).toContainText('2 minutes');
  /* And the confirmation is NOT shown — a rate limit is a fact about the request. */
  await expect(page.locator('.auth-confirmation')).toHaveCount(0);
});

test('the request survives a backend outage as a confirmation', async ({ page }) => {
  await page.route('**/api/auth/password-reset/request', (route) => route.abort());
  await page.goto('/forgot-password');
  await page.getByLabel('Work email').fill('someone@example.com');
  await page.getByRole('button', { name: /Send the reset link/i }).click();

  /* A visitor must not be able to tell a broken service from a missing account, because
     one of those answers is a fact about the account. */
  await expect(page.locator('.auth-confirmation')).toContainText('If that address has an itriX workspace');
});
