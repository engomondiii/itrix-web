import { expect, test } from '@playwright/test';

/**
 * SIGN UP IS TWO DOORS, AND BY DEFAULT ONLY ONE IS A FORM (R48).
 *
 * Architecture v2.8 §00.2 records why: accounts here are EARNED, and a public form that
 * opened a workspace on demand would produce Clients with no Lead, no journey state and
 * no disclosure basis — breaking value-first, qualification and the persona-keyed pitch
 * model at once.
 */

test('door 2 is not a form, and it reaches the conversation', async ({ page }) => {
  await page.goto('/sign-up');
  await expect(page.getByText("I don't have one yet")).toBeVisible();
  await expect(page.getByText('A workspace opens after a short conversation')).toBeVisible();

  /* It collects nothing. */
  await expect(page.locator('.password-field__input')).toHaveCount(0);
  await expect(page.locator('input[type="email"]')).toHaveCount(0);

  await page.getByRole('link', { name: /Start the conversation/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('h1')).toHaveText('What would you like computation to do better?');
});

test('door 1 hands off to the assent-gated flow rather than duplicating it', async ({ page }) => {
  await page.route('**/api/auth/invite/lookup**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ usable: true, redeemUrl: '/c/tok_handoff/create-account' }),
    }),
  );
  await page.goto('/sign-up');
  await page.getByLabel('Invitation code').fill('tok_handoff');
  await page.getByRole('button', { name: 'Continue' }).click();

  /* Rebuilding account creation here would be a second place for the assent gate to be
     forgotten. */
  await expect(page).toHaveURL(/\/c\/tok_handoff\/create-account/);
});

test('open registration is unreachable by default, on three layers', async ({ page }) => {
  await page.goto('/sign-up');
  /* Layer 1: the page does not render the form. */
  await expect(page.getByRole('button', { name: /Create workspace/i })).toHaveCount(0);
  await expect(page.locator('.assent__box')).toHaveCount(0);

  /* Layer 3: the proxy 404s. A disabled feature should not advertise itself with a 403. */
  const status = await page.evaluate(async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com', password: 'a-long-enough-pass', fullName: 'A', organization: 'B' }),
    });
    return res.status;
  });
  expect(status).toBe(404);
});

test('the code field does not fight a phone keyboard', async ({ page }) => {
  await page.goto('/sign-up');
  const field = page.getByLabel('Invitation code');
  /* A capitalised first character produces a failure the visitor cannot see. */
  await expect(field).toHaveAttribute('autocapitalize', 'off');
  await expect(field).toHaveAttribute('spellcheck', 'false');
  await expect(field).toHaveAttribute('autocomplete', 'off');
});
